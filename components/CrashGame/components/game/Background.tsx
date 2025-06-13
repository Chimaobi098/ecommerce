import { useEffect, useRef, useState } from "react";

interface BackgroundProps {
  gameState: string;
}

export function Background({ gameState }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [mountainHeight, setMountainHeight] = useState(0);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setMountainHeight(canvas.height * 0.7);
    };

    // Handle resize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create stars for background
    const stars: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.8, // Keep stars in the sky
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    // Create clouds
    const clouds: {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < 12; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3), // Keep clouds high
        width: Math.random() * 150 + 50,
        height: Math.random() * 60 + 20,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    // Create mountains
    const mountainPeaks: {
      x: number;
      height: number;
      width: number;
      color: string;
    }[] = [];
    const mountainCount = 5;
    const mountainColors = [
      "rgba(30, 30, 60, 0.8)",
      "rgba(40, 40, 70, 0.7)",
      "rgba(50, 50, 80, 0.6)",
      "rgba(60, 60, 90, 0.5)",
      "rgba(70, 70, 100, 0.4)",
    ];

    for (let i = 0; i < mountainCount; i++) {
      mountainPeaks.push({
        x: (canvas.width / (mountainCount + 1)) * (i + 1),
        height: Math.random() * 200 + 100,
        width: Math.random() * 300 + 200,
        color: mountainColors[i % mountainColors.length],
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

      // Change sky color based on game state
      if (gameState === "crashed") {
        gradient.addColorStop(0, "#300000"); // Dark red
        gradient.addColorStop(0.5, "#600000"); // Medium red
        gradient.addColorStop(1, "#200000"); // Very dark red
      } else if (gameState === "flying") {
        gradient.addColorStop(0, "#001233"); // Dark blue
        gradient.addColorStop(0.6, "#023e8a"); // Medium blue
        gradient.addColorStop(1, "#03045e"); // Deep blue
      } else {
        gradient.addColorStop(0, "#001845"); // Very dark blue
        gradient.addColorStop(0.7, "#002855"); // Medium dark blue
        gradient.addColorStop(1, "#001233"); // Dark blue
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw a moon or sun
      if (gameState === "flying" || gameState === "crashed") {
        // Draw sun or moon with glow
        const centerX = canvas.width * 0.8;
        const centerY = canvas.height * 0.2;
        const radius = 40;

        // Draw glow
        const glowGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          radius * 0.5,
          centerX,
          centerY,
          radius * 3
        );

        // Different colors based on game state
        const isGameCrashed = gameState === "crashed";

        if (isGameCrashed) {
          glowGradient.addColorStop(0, "rgba(255, 50, 50, 0.3)");
          glowGradient.addColorStop(1, "rgba(255, 0, 0, 0)");
        } else {
          glowGradient.addColorStop(0, "rgba(255, 255, 200, 0.3)");
          glowGradient.addColorStop(1, "rgba(255, 255, 200, 0)");
        }

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw the actual sun/moon
        const fillColor = isGameCrashed ? "#ff5555" : "#ffffdd";
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw stars with twinkling effect
      stars.forEach((star, index) => {
        // Make stars twinkle
        const time = Date.now() / 1000;
        const twinkle = 0.7 + Math.sin(time + index) * 0.3;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add special effect for some stars during "flying" state
        if (gameState === "flying" && index % 7 === 0) {
          ctx.fillStyle = `rgba(255, 255, 200, ${star.opacity * 0.7})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Move stars
        star.x -= star.speed;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height * 0.7;
        }
      });

      // Draw mountains
      mountainPeaks.forEach((mountain) => {
        ctx.fillStyle = mountain.color;
        ctx.beginPath();
        ctx.moveTo(mountain.x - mountain.width / 2, canvas.height);

        // Draw mountain shape using bezier curves
        ctx.bezierCurveTo(
          mountain.x - mountain.width / 4,
          canvas.height - mountain.height / 2,
          mountain.x - mountain.width / 8,
          canvas.height - mountain.height,
          mountain.x,
          canvas.height - mountain.height
        );

        ctx.bezierCurveTo(
          mountain.x + mountain.width / 8,
          canvas.height - mountain.height,
          mountain.x + mountain.width / 4,
          canvas.height - mountain.height / 2,
          mountain.x + mountain.width / 2,
          canvas.height
        );

        ctx.closePath();
        ctx.fill();

        // Add snowy peak if mountain is tall enough
        if (mountain.height > 150) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.beginPath();
          ctx.moveTo(
            mountain.x - mountain.width / 8,
            canvas.height - mountain.height + 20
          );
          ctx.lineTo(mountain.x, canvas.height - mountain.height);
          ctx.lineTo(
            mountain.x + mountain.width / 8,
            canvas.height - mountain.height + 20
          );
          ctx.closePath();
          ctx.fill();
        }
      });

      // Draw clouds
      clouds.forEach((cloud) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        drawCloud(ctx, cloud.x, cloud.y, cloud.width, cloud.height);

        // Move clouds
        cloud.x -= cloud.speed * (gameState === "flying" ? 1.5 : 1); // Clouds move faster during flight
        if (cloud.x + cloud.width < 0) {
          cloud.x = canvas.width;
          cloud.y = Math.random() * (canvas.height / 3);
          cloud.width = Math.random() * 150 + 50;
          cloud.height = Math.random() * 60 + 20;
          cloud.opacity = Math.random() * 0.4 + 0.1;
        }
      });

      // Add special effects for different game states
      if (gameState === "crashed") {
        // Add red particles for the crash
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 3 + 1;

          ctx.fillStyle = `rgba(255, ${Math.random() * 100}, 0, ${
            Math.random() * 0.5
          })`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (gameState === "flying") {
        // Add motion lines during flight
        const lines = 10;
        const lineLength = 50;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;

        for (let i = 0; i < lines; i++) {
          const y = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(lineLength, y);
          ctx.stroke();
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    // Draw a cloud
    const drawCloud = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      ctx.beginPath();

      // Draw multiple circles for a more realistic cloud
      const circleCount = Math.floor(width / 30);
      for (let i = 0; i < circleCount; i++) {
        const circleX = x + i * (width / circleCount);
        const circleY =
          y + Math.sin((i / circleCount) * Math.PI) * (height / 2);
        const radius = (Math.random() * 0.5 + 0.5) * height;

        ctx.moveTo(circleX + radius, circleY);
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      }

      ctx.fill();
    };

    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
