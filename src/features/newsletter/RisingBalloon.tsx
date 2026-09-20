"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import balloon from "../../../public/brand/pinkfly-balloon.png";

/**
 * The Pinkfly balloon, rising.
 *
 * The brand's own mark, not a redrawing of it. An earlier version was a
 * hand-authored SVG of the same idea, and the woman's profile inside the
 * envelope — the entire point of the mark — did not survive being drawn by
 * hand at this size: it read as a blob. The real artwork is already correct,
 * so it is cut out (`npm run build:icons` writes the transparent balloon)
 * and moved rather than imitated.
 *
 * What the mark says is why it belongs on this dialog: the woman is not a
 * passenger on the balloon, she is the balloon. The invitation is to the
 * person looking at it.
 *
 * It sits on a pale disc because the envelope is near-black and so is the
 * dialog in the dark theme; the disc is what keeps the mark legible on both,
 * which is why it does not follow the theme. It drifts rather than bounces —
 * an invitation that jumps is an advert. Anyone whose system asks for less
 * motion gets the mark, still.
 */
export function RisingBalloon({ size = 96 }: { size?: number }) {
  const still = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        // A fixed pale disc rather than a theme token. The mark's envelope is
        // near-black in both themes, and `--pf-accent-soft` goes dark with
        // the page — on the dark theme the balloon vanished into it and only
        // the pink hair showed. The disc has to stay light for the artwork to
        // read, so it does not follow the theme.
        background: "#FBE9F2",
      }}
      initial={still ? false : { y: 22, opacity: 0, scale: 0.94 }}
      animate={still ? undefined : { y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={
          still ? undefined : { y: [0, -6, 0], rotate: [-2.5, 2.5, -2.5] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        // The mark hangs from its envelope, so it swings about the crown
        // rather than about its middle — the way a balloon actually moves.
        style={{ transformOrigin: "50% 15%" }}
      >
        <Image
          src={balloon}
          alt=""
          height={Math.round(size * 0.68)}
          width={Math.round(size * 0.68 * (476 / 739))}
          className="select-none"
          priority={false}
        />
      </motion.div>
    </motion.div>
  );
}
