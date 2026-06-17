import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { theme } from "../../../remotion-src/theme";
import { SceneBackground, SceneHeading, gradientText, CameraRig, pop, EASE_OUT } from "../../../remotion-src/visuals";

// Scene 10 — MCP: USB for AI
// A central HOST (the harness) connects via a labeled "MCP protocol" bus to
// three server cards that pop in (GitHub, Postgres, Browser). Each card exposes
// tools the same standard way, with a USB/plug motif on every connection.
// Caption: "Write a server once — any agent can plug in."

const BLUE = theme.tokenColors[4]; // blue

const Plug: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34 }}>
    {/* USB plug glyph */}
    <div
      style={{
        position: "relative",
        width: 14,
        height: 22,
        borderRadius: 3,
        background: color,
        boxShadow: `0 0 12px ${color}aa`,
      }}
    >
      <div style={{ position: "absolute", top: -7, left: 2, width: 4, height: 7, background: color, borderRadius: 1 }} />
      <div style={{ position: "absolute", top: -7, right: 2, width: 4, height: 7, background: color, borderRadius: 1 }} />
    </div>
  </div>
);

const ServerCard: React.FC<{
  name: string;
  tools: string[];
  appear: number;
}> = ({ name, tools, appear }) => {
  const scale = interpolate(appear, [0, 1], [0.6, 1]);
  return (
    <div
      style={{
        opacity: Math.min(1, appear * 1.4),
        transform: `scale(${scale})`,
        width: 320,
        background: theme.surface,
        border: `1.5px solid ${BLUE}66`,
        borderRadius: 18,
        padding: "22px 24px",
        boxShadow: `0 0 28px ${BLUE}22`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Plug color={BLUE} />
        <div style={{ fontFamily: theme.fontMono, fontSize: 30, fontWeight: 800, color: theme.text }}>{name}</div>
      </div>
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 22,
          color: BLUE,
          letterSpacing: 1,
          borderTop: `1px solid ${theme.border}`,
          paddingTop: 12,
        }}
      >
        tools ▸
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tools.map((t) => (
          <div key={t} style={{ fontFamily: theme.fontMono, fontSize: 24, color: theme.textMuted }}>
            • {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Scene10MCP: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Host appears first.
  const hostS = pop(frame, fps, fps * 1.0, { damping: 12 });
  const hostScale = interpolate(hostS, [0, 1], [0.7, 1]);
  const hostPulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // Bus draws out from host toward servers.
  const bus = interpolate(frame, [fps * 2.0, fps * 3.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // Three server cards stagger in.
  const s1 = pop(frame, fps, fps * 3.6, { damping: 12 });
  const s2 = pop(frame, fps, fps * 5.0, { damping: 12 });
  const s3 = pop(frame, fps, fps * 6.4, { damping: 12 });

  // Standard / open standard tag.
  const tagOpacity = interpolate(frame, [fps * 8.0, fps * 9.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Caption.
  const capS = pop(frame, fps, fps * 22.5, { damping: 13 });
  const capOpacity = interpolate(frame, [fps * 22.5, fps * 23.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneBackground glow={BLUE} />

      <CameraRig>
        <SceneHeading kicker="the ecosystem" accent={BLUE}>
          MCP — <span style={gradientText("#bfdbfe", BLUE)}>USB for AI</span>
        </SceneHeading>

        {/* Stage */}
        <div style={{ position: "absolute", top: 320, left: 0, right: 0, bottom: 130, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0 }}>
          {/* Host node */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 360, opacity: Math.min(1, hostS * 1.5), transform: `scale(${hostScale})` }}>
            <div
              style={{
                width: 230,
                height: 230,
                borderRadius: 28,
                background: `radial-gradient(circle at 38% 32%, ${BLUE}cc 0%, ${BLUE} 45%, #1e3a8a 100%)`,
                boxShadow: `0 0 ${36 + hostPulse * 44}px ${BLUE}, inset 0 0 36px rgba(255,255,255,0.22)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                color: theme.text,
              }}
            >
              <div style={{ fontFamily: theme.fontSans, fontSize: 36, fontWeight: 800 }}>HOST</div>
              <div style={{ fontFamily: theme.fontMono, fontSize: 22, color: "#dbeafe" }}>the harness</div>
            </div>
          </div>

          {/* Bus + servers */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0 }}>
            {/* MCP protocol bus */}
            <div style={{ position: "relative", width: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  width: "100%",
                  height: 6,
                  borderRadius: 3,
                  transformOrigin: "left center",
                  transform: `scaleX(${bus})`,
                  background: `linear-gradient(90deg, ${BLUE}, ${BLUE}55)`,
                  boxShadow: `0 0 16px ${BLUE}aa`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -42,
                  fontFamily: theme.fontMono,
                  fontSize: 24,
                  color: BLUE,
                  letterSpacing: 1,
                  opacity: bus,
                  whiteSpace: "nowrap",
                }}
              >
                MCP protocol
              </div>
              <div style={{ position: "absolute", right: -2, opacity: bus }}>
                <Plug color={BLUE} />
              </div>
            </div>

            {/* Server cards stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <ServerCard name="GitHub" tools={["create_pr", "read_file"]} appear={s1} />
              <ServerCard name="Postgres" tools={["query", "schema"]} appear={s2} />
              <ServerCard name="Browser" tools={["navigate", "click"]} appear={s3} />
            </div>
          </div>
        </div>

        {/* Open-standard tag */}
        <div
          style={{
            position: "absolute",
            top: 250,
            width: "100%",
            textAlign: "center",
            opacity: tagOpacity,
          }}
        >
          <span
            style={{
              fontFamily: theme.fontMono,
              fontSize: 24,
              color: theme.textMuted,
              border: `1px solid ${theme.border}`,
              borderRadius: 999,
              padding: "6px 18px",
              background: theme.surface,
            }}
          >
            open standard · late 2024
          </span>
        </div>

        {/* Caption */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            width: "100%",
            textAlign: "center",
            opacity: capOpacity,
            transform: `translateY(${(1 - capS) * 20}px)`,
            fontFamily: theme.fontSans,
            fontSize: 38,
            color: theme.text,
          }}
        >
          Write a server <span style={{ color: BLUE }}>once</span> — any agent can plug in.
        </div>
      </CameraRig>
    </AbsoluteFill>
  );
};
