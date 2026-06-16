// t01 motion toolkit was promoted into the shared module. This file now just
// re-exports it so t01's scenes (which import from "../motion") keep working.
export { SceneBackground, SceneHeading, CameraRig, pop, ModelCore, gradientText, EASE_OUT } from "../../remotion-src/visuals";
