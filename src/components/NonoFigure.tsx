import type { CSSProperties } from "react";
import type { NonoPose } from "@/lib/nono";
import { NatalNonoHatSlot, NONO_HAT_ROOM, useNatalActive, type NonoHatPose } from "./seasonal";

interface NonoFigureProps {
  pose: NonoPose;
  /** Which artwork, so the seasonal hat knows where the head is. */
  hat: NonoHatPose;
  /** Classes of the plain <img> (outside any season: rendered exactly as before). */
  className: string;
  /** In season: classes for the wrapper that takes the image's place. */
  seasonClassName: string;
  /** In season: classes for the image inside the wrapper. */
  seasonImgClassName?: string;
  /** Reserve head room above the image for the hat (where text sits close above). */
  hatRoom?: boolean;
  sizes?: string;
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
}

/**
 * Nono's artwork. During Christmas it wraps the image in a box of the same
 * size and puts the Santa hat on top; otherwise it is the same <img> as ever.
 */
export function NonoFigure({
  pose,
  hat,
  className,
  seasonClassName,
  seasonImgClassName = "block w-full h-auto",
  hatRoom = false,
  sizes,
  loading,
  decoding,
}: NonoFigureProps) {
  const natal = useNatalActive();
  const imgProps = {
    src: pose.src,
    srcSet: pose.srcSet,
    sizes,
    width: pose.width,
    height: pose.height,
    loading,
    decoding,
  };

  if (!natal) return <img {...imgProps} alt={pose.alt} className={className} />;

  const style: CSSProperties | undefined = hatRoom ? { paddingTop: `${NONO_HAT_ROOM[hat]}%` } : undefined;
  return (
    <span className={seasonClassName} style={style} data-nono-figure={hat}>
      {/* the image box: the hat is placed in % of it */}
      <span className="relative block h-full">
        <img {...imgProps} alt={`${pose.alt}, de gorro de Papai Noel`} className={seasonImgClassName} />
        <NatalNonoHatSlot pose={hat} />
      </span>
    </span>
  );
}
