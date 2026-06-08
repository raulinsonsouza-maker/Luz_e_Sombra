import type { MPMask, NormalizedLandmark, PoseLandmarker } from "@mediapipe/tasks-vision";

const TASKS_VISION_VERSION = "0.10.35";
const POSE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task";

let posePromise: Promise<PoseLandmarker> | null = null;

async function createPoseLandmarker(): Promise<PoseLandmarker> {
  const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");
  const wasm = await FilesetResolver.forVisionTasks(
    `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`
  );
  const tryCreate = (delegate: "GPU" | "CPU") =>
    PoseLandmarker.createFromOptions(wasm, {
      baseOptions: {
        modelAssetPath: POSE_MODEL,
        delegate,
      },
      runningMode: "IMAGE",
      numPoses: 1,
      minPoseDetectionConfidence: 0.35,
      minPosePresenceConfidence: 0.35,
      minTrackingConfidence: 0.35,
      outputSegmentationMasks: true,
    });

  try {
    return await tryCreate("GPU");
  } catch {
    return await tryCreate("CPU");
  }
}

export async function getPoseLandmarker(): Promise<PoseLandmarker> {
  if (!posePromise) posePromise = createPoseLandmarker();
  return posePromise;
}

export async function extrairMascaraUint8(mask: MPMask | undefined): Promise<{
  data: Uint8Array | null;
  width: number;
  height: number;
}> {
  if (!mask) return { data: null, width: 0, height: 0 };
  const w = mask.width;
  const h = mask.height;
  if (mask.hasUint8Array()) {
    return { data: mask.getAsUint8Array(), width: w, height: h };
  }
  if (mask.hasFloat32Array()) {
    const f = mask.getAsFloat32Array();
    const u = new Uint8Array(f.length);
    for (let i = 0; i < f.length; i++) {
      const v = f[i] ?? 0;
      u[i] = v > 0.5 ? 255 : 0;
    }
    return { data: u, width: w, height: h };
  }
  return { data: null, width: w, height: h };
}

export type PoseDeteccao = {
  landmarks: NormalizedLandmark[] | null;
  mask: Uint8Array | null;
  maskWidth: number;
  maskHeight: number;
};

export async function detectarPoseNaImagem(image: HTMLImageElement): Promise<PoseDeteccao> {
  const pose = await getPoseLandmarker();
  const result = pose.detect(image);
  const lm0 = result.landmarks[0];
  const landmarks = lm0 ?? null;

  let mask: Uint8Array | null = null;
  let mw = 0;
  let mh = 0;
  const seg = result.segmentationMasks?.[0];
  if (seg) {
    const ex = await extrairMascaraUint8(seg);
    mask = ex.data;
    mw = ex.width;
    mh = ex.height;
    seg.close?.();
  }
  result.close?.();

  return {
    landmarks,
    mask,
    maskWidth: mw,
    maskHeight: mh,
  };
}
