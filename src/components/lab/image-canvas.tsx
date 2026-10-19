import {
  useCallback,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

/* ------------------------------------------------------------------ */
/*  ImageCanvas — полотно, куди учень може перетягнути фото зі свого   */
/*  комп'ютера (наприклад, знімки установки чи результатів досліду),   */
/*  вільно розташувати їх і змінити розмір. Реалізовано звичайними     */
/*  <img>, а не <canvas>, щоб html2canvas у lab-form.tsx знімав кожне  */
/*  фото з його реальною роздільністю — це і дає достатню якість у     */
/*  підсумковому PDF.                                                  */
/* ------------------------------------------------------------------ */

type PlacedImage = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Довша сторона фото після оптимізації. 1600px — достатньо для чіткого
// друку на A4 навіть у половину ширини сторінки, але не роздуває base64.
const MAX_IMAGE_SIDE = 1600;
const DEFAULT_PLACED_WIDTH = 220;
const MIN_PLACED_WIDTH = 60;

let uidCounter = 0;
function nextId(): string {
  uidCounter += 1;
  return `photo-${Date.now()}-${uidCounter}`;
}

/** Зчитує файл як зображення і за потреби стискає його так, щоб довша
 *  сторона не перевищувала MAX_IMAGE_SIDE — якість лишається достатньою
 *  для друку, а PDF не роздувається через мегапіксельні фото з телефона. */
async function fileToOptimizedImage(file: File): Promise<{
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Не вдалося прочитати зображення"));
    el.src = rawDataUrl;
  });

  const { naturalWidth, naturalHeight } = img;
  const longestSide = Math.max(naturalWidth, naturalHeight);

  if (!naturalWidth || !naturalHeight || longestSide <= MAX_IMAGE_SIDE) {
    return { src: rawDataUrl, naturalWidth, naturalHeight };
  }

  const scale = MAX_IMAGE_SIDE / longestSide;
  const targetWidth = Math.round(naturalWidth * scale);
  const targetHeight = Math.round(naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { src: rawDataUrl, naturalWidth, naturalHeight };

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return {
    src: canvas.toDataURL("image/jpeg", 0.92),
    naturalWidth: targetWidth,
    naturalHeight: targetHeight,
  };
}

export function ImageCanvas({
  label = "Перетягніть сюди фото з виконання роботи",
  height = 360,
  minHeight = 180,
  maxHeight = 900,
  maxImages = 8,
}: {
  /** Підпис над полотном */
  label?: string;
  /** Початкова висота полотна в пікселях (учень може потім розтягнути) */
  height?: number;
  /** Мінімальна висота, до якої можна стиснути полотно перетягуванням */
  minHeight?: number;
  /** Максимальна висота, до якої можна розтягнути полотно перетягуванням */
  maxHeight?: number;
  /** Максимальна кількість фото на одному полотні */
  maxImages?: number;
}) {
  const [images, setImages] = useState<PlacedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  // Висота полотна керована самим учнем — розтягується за нижню межу.
  const [canvasHeight, setCanvasHeight] = useState(height);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const placedCount = useRef(0);

  const dragState = useRef<{
    id: string;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origWidth: number;
    aspect: number;
  } | null>(null);

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const container = containerRef.current;
      const bounds = container?.getBoundingClientRect();
      const containerWidth = bounds?.width ?? 600;
      const containerHeight = bounds?.height ?? canvasHeight;

      const files = Array.from(fileList).filter((f) =>
        f.type.startsWith("image/"),
      );

      for (const file of files) {
        if (placedCount.current >= maxImages) break;
        try {
          const { src, naturalWidth, naturalHeight } =
            await fileToOptimizedImage(file);
          const aspect =
            naturalWidth && naturalHeight ? naturalHeight / naturalWidth : 1;
          const width = Math.min(DEFAULT_PLACED_WIDTH, containerWidth - 20);
          const heightPx = width * aspect;
          const step = placedCount.current;

          placedCount.current += 1;
          setImages((prev) => [
            ...prev,
            {
              id: nextId(),
              src,
              x: Math.min(
                10 + step * 24,
                Math.max(10, containerWidth - width - 10),
              ),
              y: Math.min(
                10 + step * 24,
                Math.max(10, containerHeight - heightPx - 10),
              ),
              width,
              height: heightPx,
            },
          ]);
        } catch {
          // ігноруємо файл, який браузер не зміг прочитати як зображення
        }
      }
    },
    [canvasHeight, maxImages],
  );

  const handleDrop = useCallback(
    (e: ReactDragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files?.length) {
        void addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), Math.max(min, max));

  const handlePointerDown = (
    e: ReactPointerEvent<HTMLDivElement>,
    image: PlacedImage,
    mode: "move" | "resize",
  ) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      id: image.id,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origX: image.x,
      origY: image.y,
      origWidth: image.width,
      aspect: image.height / image.width,
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    const container = containerRef.current;
    if (!drag || !container) return;

    const bounds = container.getBoundingClientRect();
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    setImages((prev) =>
      prev.map((img) => {
        if (img.id !== drag.id) return img;

        if (drag.mode === "move") {
          const x = clamp(drag.origX + dx, 0, bounds.width - img.width);
          const y = clamp(drag.origY + dy, 0, bounds.height - img.height);
          return { ...img, x, y };
        }

        // Зміна розміру за правий нижній кут — пропорції зберігаються
        const maxWidth = bounds.width - img.x;
        const width = clamp(drag.origWidth + dx, MIN_PLACED_WIDTH, maxWidth);
        return { ...img, width, height: width * drag.aspect };
      }),
    );
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    placedCount.current = Math.max(0, placedCount.current - 1);
  };

  // Перетягування нижньої межі полотна мишею/пальцем — міняє canvasHeight.
  // Слухачі вішаються на window (а не на контейнер), бо під час перетягування
  // курсор часто виходить за межі самого полотна.
  const handleHeightResizeStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const startHeight = canvasHeight;
    let latestHeight = startHeight;

    const onMove = (moveEvent: PointerEvent) => {
      const dy = moveEvent.clientY - startY;
      latestHeight = clamp(startHeight + dy, minHeight, maxHeight);
      setCanvasHeight(latestHeight);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      // Якщо полотно стиснули менше, ніж потрібно якомусь фото — підтягуємо
      // фото вгору, щоб воно лишалось повністю видимим (і не зникло в PDF).
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          y: clamp(img.y, 0, Math.max(0, latestHeight - img.height)),
        })),
      );
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= maxImages}
          className="pdf-hide rounded-full border border-input bg-background px-4 py-1.5 text-xs font-medium text-foreground transition hover:border-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Додати фото
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div
        ref={containerRef}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ height: canvasHeight }}
        className={`pdf-keep relative w-full overflow-hidden rounded-2xl border-2 border-dashed bg-card shadow-card transition-colors ${
          isDragOver ? "border-ring bg-accent/10" : "border-border"
        }`}
      >
        {images.length === 0 && (
          <p className="pdf-hide pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
            Перетягніть сюди фото або натисніть «Додати фото»
          </p>
        )}

        {images.map((img) => (
          <div
            key={img.id}
            onPointerDown={(e) => handlePointerDown(e, img, "move")}
            style={{
              position: "absolute",
              left: img.x,
              top: img.y,
              width: img.width,
              height: img.height,
              touchAction: "none",
            }}
            className="group cursor-move"
          >
            <img
              src={img.src}
              draggable={false}
              className="h-full w-full select-none rounded-lg border border-border object-contain shadow-md"
              alt="Фото з виконання роботи"
            />
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => removeImage(img.id)}
              className="pdf-hide absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
              aria-label="Видалити фото"
            >
              ×
            </button>
            <div
              onPointerDown={(e) => handlePointerDown(e, img, "resize")}
              className="pdf-hide absolute -right-1 -bottom-1 h-4 w-4 cursor-se-resize rounded-sm border border-border bg-background opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
            />
          </div>
        ))}

        {/* Ручка для зміни висоти полотна перетягуванням нижньої межі */}
        <div
          onPointerDown={handleHeightResizeStart}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Змінити висоту полотна"
          style={{ touchAction: "none" }}
          className="pdf-hide absolute inset-x-0 bottom-0 flex h-3 cursor-ns-resize items-center justify-center"
        >
          <div className="h-1 w-12 rounded-full bg-border" />
        </div>
      </div>
    </div>
  );
}
