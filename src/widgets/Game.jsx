// src/pages/Game.jsx
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Phaser from "phaser";

const Game = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const phaserRef = useRef(null);

  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);

  // Destroy existing game
  const destroyGame = () => {
    if (phaserRef.current) {
      phaserRef.current.destroy(true);
      phaserRef.current = null;
    }
  };

  // Init new Phaser game
  const initGame = () => {
    const config = {
      type: Phaser.AUTO,
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
      parent: containerRef.current,
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 300 }, debug: false },
      },
      scene: {
        key: "MAIN",
        preload: function () {
          this.load.setBaseURL("https://labs.phaser.io");
          this.load.image("sky", "assets/skies/space3.png");
          this.load.image("coin", "assets/sprites/gold_1.png");
          this.load.image("player", "assets/sprites/phaser-dude.png");
        },
        create: function () {
          this.add.image(400, 300, "sky");

          this.player = this.physics.add.sprite(100, 450, "player");
          this.player.setCollideWorldBounds(true);

          this.coins = this.physics.add.group({
            key: "coin",
            repeat: 5,
            setXY: { x: 50, y: 0, stepX: 120 },
          });

          this.physics.add.overlap(
            this.player,
            this.coins,
            (player, coin) => {
              coin.disableBody(true, true);
              this.events.emit("coin-collected");
            },
            null,
            this
          );

          this.game.events.emit("ready");
        },
        update: function () {
          if (this.input.keyboard?.addKey("RIGHT").isDown) {
            this.player.setVelocityX(200);
          } else if (this.input.keyboard?.addKey("LEFT").isDown) {
            this.player.setVelocityX(-200);
          } else {
            this.player.setVelocityX(0);
          }
        },
      },
    };

    const game = new Phaser.Game(config);
    phaserRef.current = game;

    // Wait for scene "ready" before binding
    game.events.on("ready", () => {
      const scene = game.scene.getScene("MAIN");
      if (!scene) return;

      scene.events.on("coin-collected", () => setScore((s) => s + 10));
    });
  };

  // React lifecycle
  useEffect(() => {
    initGame();
    return () => destroyGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    restart: () => {
      destroyGame();
      initGame();
      setScore(0);
    },
    exit: () => {
      destroyGame();
      props.onExit && props.onExit();
    },
  }));

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ touchAction: "manipulation" }}
      />

      {/* Score */}
      <div className="absolute top-4 left-4 p-2 rounded-md bg-white/30 backdrop-blur-sm text-white">
        <div className="text-sm">Score</div>
        <div className="text-2xl font-bold">{score}</div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className="px-3 py-1 rounded-md bg-white/90 text-black font-medium shadow"
          onClick={() => {
            const scene = phaserRef.current?.scene.getScene("MAIN");
            if (paused) {
              scene.physics.resume();
              setPaused(false);
            } else {
              scene.physics.pause();
              setPaused(true);
            }
          }}
        >
          {paused ? "Resume" : "Pause"}
        </button>

        <button
          className="px-3 py-1 rounded-md bg-white/90 text-black font-medium shadow"
          onClick={() => {
            destroyGame();
            initGame();
            setScore(0);
            setPaused(false);
          }}
        >
          Restart
        </button>

        <button
          className="px-3 py-1 rounded-md bg-white/90 text-black font-medium shadow"
          onClick={() => {
            destroyGame();
            props.onExit && props.onExit();
          }}
        >
          Exit
        </button>
      </div>

      {/* Pause overlay */}
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Paused</h3>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 rounded-md bg-green-500 text-white"
                onClick={() => {
                  const scene = phaserRef.current?.scene.getScene("MAIN");
                  scene.physics.resume();
                  setPaused(false);
                }}
              >
                Resume
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white"
                onClick={() => {
                  destroyGame();
                  initGame();
                  setScore(0);
                  setPaused(false);
                }}
              >
                Restart
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white"
                onClick={() => {
                  destroyGame();
                  props.onExit && props.onExit();
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Game;
