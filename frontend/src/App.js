import React, { useState, useEffect, useRef } from "react";

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const DROP_INTERVAL = 800;

const TETROMINOS = {
  0: { shape: [[0]], color: "0,0,0" },
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "80, 227, 230",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "36, 95, 223",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "223, 173, 36",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "223, 217, 36",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "48, 211, 56",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "132, 61, 198",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "227, 78, 78",
  },
};

const createBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill([0, "0,0,0"]));

function randomTetromino() {
  const tetrominos = "IJLOSTZ";
  const rand = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[rand];
}

function rotate(matrix) {
  return matrix[0].map((_, index) =>
    matrix.map((row) => row[index]).reverse()
  );
}

function checkCollision(board, shape, pos) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newY = pos.y + y;
        const newX = pos.x + x;
        if (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          (newY >= 0 && board[newY][newX][0] !== 0)
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

export default function App() {
  const [board, setBoard] = useState(createBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [piece, setPiece] = useState(null);
  const dropTimeRef = useRef(DROP_INTERVAL);

  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed!");
      return;
    }
  
    try {
      setConnecting(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error("Wallet connection failed", err);
      alert("Could not connect wallet.");
    } finally {
      setConnecting(false);
    }  
  };

  const startGame = () => {
    if (!walletAddress) return;
    setBoard(createBoard());
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    const newPiece = randomTetromino();
    setPiece({
      shape: newPiece.shape,
      color: newPiece.color,
      pos: { x: Math.floor(COLS / 2) - 2, y: -2 },
    });
  };

  const stopGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setPiece(null);
    setBoard(createBoard());
    setScore(0);
  };

  const placePiece = (board, piece) => {
    const newBoard = board.map((row) => row.slice());
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value && piece.pos.y + y >= 0) {
          newBoard[piece.pos.y + y][piece.pos.x + x] = [1, piece.color];
        }
      });
    });
    return newBoard;
  };

  const clearRows = (board) => {
    let cleared = 0;
    const newBoard = board.filter((row) => {
      if (row.every((cell) => cell[0] !== 0)) {
        cleared++;
        return false;
      }
      return true;
    });
    while (newBoard.length < ROWS) {
      newBoard.unshift(Array(COLS).fill([0, "0,0,0"]));
    }
    if (cleared > 0) {
      setScore((s) => s + cleared * 10);
    }
    return newBoard;
  };

  const movePiece = (dir) => {
    if (!gameStarted || gameOver) return;
    const newPos = { x: piece.pos.x + dir, y: piece.pos.y };
    if (!checkCollision(board, piece.shape, newPos)) {
      setPiece((p) => ({ ...p, pos: newPos }));
    }
  };

  const drop = () => {
    if (!gameStarted || gameOver) return;
    const newPos = { x: piece.pos.x, y: piece.pos.y + 1 };
    if (!checkCollision(board, piece.shape, newPos)) {
      setPiece((p) => ({ ...p, pos: newPos }));
    } else {
      if (piece.pos.y < 0) {
        setGameOver(true);
        setGameStarted(false);
        return;
      }
      const newBoard = placePiece(board, piece);
      const clearedBoard = clearRows(newBoard);
      setBoard(clearedBoard);
      const newPiece = randomTetromino();
      const startPos = { x: Math.floor(COLS / 2) - 2, y: -2 };
      if (checkCollision(clearedBoard, newPiece.shape, startPos)) {
        setGameOver(true);
        setGameStarted(false);
      } else {
        setPiece({
          shape: newPiece.shape,
          color: newPiece.color,
          pos: startPos,
        });
      }
    }
  };

  const hardDrop = () => {
    if (!gameStarted || gameOver) return;
    let dropY = piece.pos.y;
    while (!checkCollision(board, piece.shape, { x: piece.pos.x, y: dropY + 1 })) {
      dropY++;
    }
    setPiece((p) => ({ ...p, pos: { x: p.pos.x, y: dropY } }));
  };

  const rotatePiece = () => {
    if (!gameStarted || gameOver) return;
    const rotated = rotate(piece.shape);
    if (!checkCollision(board, rotated, piece.pos)) {
      setPiece((p) => ({ ...p, shape: rotated }));
    }
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const interval = setInterval(() => {
      drop();
    }, dropTimeRef.current);
    return () => clearInterval(interval);
  }, [piece, board, gameOver, gameStarted]);

  useEffect(() => {
    function handleKey(e) {
      if (!gameStarted || gameOver) return;
      const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
      if (keysToPrevent.includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") movePiece(-1);
      else if (e.key === "ArrowRight") movePiece(1);
      else if (e.key === "ArrowDown") {
        dropTimeRef.current = 50;
        drop();
      } else if (e.key === "ArrowUp") rotatePiece();
      else if (e.key === " ") hardDrop();
    }
    function handleKeyUp(e) {
      if (e.key === "ArrowDown") dropTimeRef.current = DROP_INTERVAL;
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver, piece, board]);

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background: "linear-gradient(135deg, #1e1e2f, #121212)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 20,
        color: "#fff",
        position: "relative",
      }}
    >
      <h1 style={{ marginBottom: 10 }}>React Tetris</h1>

      {/* Wallet Connect */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
        {!walletAddress ? (
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff9900",
              color: "#000",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {connecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div
            style={{
              padding: "8px 16px",
              backgroundColor: "#222",
              color: "#fff",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            Connected: {walletAddress}
          </div>
        )}
      </div>

      {/* Game Board */}
      <div
        style={{
          position: "relative",
          width: COLS * BLOCK_SIZE,
          height: ROWS * BLOCK_SIZE,
          backgroundColor: "#111",
          border: "4px solid #555",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {board.map((row, y) =>
          row.map(([filled, color], x) => {
            let isCurrent = false;
            if (gameStarted && piece) {
              const py = y - piece.pos.y;
              const px = x - piece.pos.x;
              if (
                py >= 0 &&
                py < piece.shape.length &&
                px >= 0 &&
                px < piece.shape[0].length &&
                piece.shape[py][px]
              ) {
                isCurrent = true;
              }
            }
            const blockColor = isCurrent ? piece.color : color;
            const blockFilled = isCurrent || filled;
            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: BLOCK_SIZE - 2,
                  height: BLOCK_SIZE - 2,
                  backgroundColor: blockFilled
                    ? `rgba(${blockColor}, 0.9)`
                    : "transparent",
                  border: blockFilled ? "1px solid #222" : "1px solid #333",
                  boxSizing: "border-box",
                  position: "absolute",
                  top: y * BLOCK_SIZE,
                  left: x * BLOCK_SIZE,
                  borderRadius: 4,
                }}
              />
            );
          })
        )}

        {/* Score */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "4px 8px",
            borderRadius: 4,
            color: "#fff",
            fontSize: 16,
            fontFamily: "monospace",
            zIndex: 5,
          }}
        >
          Score: {score}
        </div>

        {/* Game Over or Start */}
        {(!gameStarted || gameOver) && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99,
              color: "#fff",
            }}
          >
            {gameOver && <div style={{ fontSize: 32 }}>Game Over</div>}
            {gameOver && (
              <div style={{ fontSize: 18, marginBottom: 20 }}>
                Final Score: {score}
              </div>
            )}
            <button
              onClick={startGame}
              disabled={!walletAddress}
              style={{
                padding: "12px 24px",
                fontSize: 18,
                borderRadius: 6,
                backgroundColor: walletAddress ? "#ff5e5e" : "#666",
                color: "#fff",
                border: "none",
                cursor: walletAddress ? "pointer" : "not-allowed",
              }}
              title={walletAddress ? "" : "Connect wallet to start the game"}
            >
              {gameOver ? "Restart Game" : "Start Game"}
            </button>
          </div>
        )}
      </div>

      {gameStarted && !gameOver && (
        <button
          onClick={stopGame}
          style={{
            marginTop: 16,
            padding: "8px 16px",
            fontSize: 14,
            borderRadius: 6,
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Stop Game
        </button>
      )}

      <div style={{ marginTop: 20, fontSize: 14, color: "#ccc" }}>
        Controls: ← → move, ↑ rotate, ↓ soft drop, Space hard drop
      </div>
    </div>
  );
}
