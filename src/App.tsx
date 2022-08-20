import { useRef, useState } from "react";
import "./styles.css";

const tamanhoTabuleiro = 800;

const largura = tamanhoTabuleiro / 8;
const altura = tamanhoTabuleiro / 8;

type PecaType = {
  tipo: "peao";
  cor: "preto" | "branco";
  posicao: number;
  historico: number[];
  imagem: string;
};

function App() {
  const inverte = useRef(false);
  const pecaMovendo = useRef<PecaType | null>(null);
  const [posicaoSendJogada, setPosicaoSendJogada] = useState<number | null>(
    null
  );

  console.log("posicaoSendJogada", posicaoSendJogada);

  const [comidos, setComidos] = useState<PecaType[]>([]);

  const [areas, setAreas] = useState(
    Array.from(Array(64)).map((item, index) => {
      let cor = null;

      if (index % 8 === 0) {
        inverte.current = !inverte.current;
      }

      if (inverte.current === false) {
        cor = index % 2 === 0 ? "black" : "white";
      } else {
        cor = index % 2 === 0 ? "white" : "black";
      }

      return {
        posicao: index,
        cor: cor,
      };
    })
  );

  const [pecas, setPecas] = useState<PecaType[]>([
    {
      tipo: "peao",
      cor: "preto",
      posicao: 48,
      historico: [48],
      imagem: "/assets/images/peao-preto.png",
    },
    {
      tipo: "peao",
      cor: "preto",
      posicao: 49,
      historico: [49],
      imagem: "/assets/images/peao-preto.png",
    },
    {
      tipo: "peao",
      cor: "preto",
      posicao: 50,
      historico: [50],
      imagem: "/assets/images/peao-preto.png",
    },
    {
      tipo: "peao",
      cor: "preto",
      posicao: 51,
      historico: [51],
      imagem: "/assets/images/peao-preto.png",
    },
    {
      tipo: "peao",
      cor: "preto",
      posicao: 52,
      historico: [52],
      imagem: "/assets/images/peao-preto.png",
    },
    {
      tipo: "peao",
      cor: "preto",
      posicao: 53,
      historico: [53],
      imagem: "/assets/images/peao-preto.png",
    },
    {
      tipo: "peao",
      cor: "preto",
      posicao: 54,
      historico: [54],
      imagem: "/assets/images/peao-preto.png",
    },
    {
      tipo: "peao",
      cor: "preto",
      posicao: 55,
      historico: [55],
      imagem: "/assets/images/peao-preto.png",
    },
  ]);

  const retornarPeca = (posicao: number) => {
    const peca = pecas.find((item) => item.posicao === posicao);

    if (peca) {
      return (
        <img
          onDrag={() => {
            pecaMovendo.current = peca;
          }}
          draggable
          src={peca.imagem}
          alt={peca.tipo}
        />
      );
    }

    return null;
  };

  const atualizarPosicao = (posicaoAtual: number, novaPosicao: number) => {
    setPecas(
      [...pecas].map((item) => {
        if (item.posicao === posicaoAtual) {
          item.posicao = novaPosicao;

          item.historico.push(novaPosicao);
        }

        return { ...item };
      })
    );
  };

  const getClass = (cor: string) => {
    if (cor === "black") {
      return "area area-par";
    } else {
      return "area area-impar";
    }
  };

  const getClassDrop = (habilitadoSoltar: boolean) => {
    if (!pecaMovendo.current) {
      return "";
    }

    if (habilitadoSoltar) {
      return "area-drop";
    } else {
      return "area-no-drop";
    }
  };

  const validaComerPeao = (posicaoAtual: number) => {
    const posicoes = [posicaoAtual - 8 + 1, posicaoAtual - 8 - 1];

    return posicoes;
  };

  const mover = (novaPosicao: number) => {
    if (validaSePodeMover(novaPosicao)) {
      if (podeMoverDiagonal()) {
        const itemNaPosicao = pecas.find(
          (item) => item.posicao === novaPosicao
        );

        if (itemNaPosicao) {
          setComidos((prev) => [...prev, itemNaPosicao]);

          setPecas((prev) => [
            ...prev.filter((item) => item.posicao !== novaPosicao),
          ]);
        }
      }

      atualizarPosicao(pecaMovendo.current?.posicao!, novaPosicao);
    }
  };

  const podeMoverCaminhoReto = (novaPosicao: number) => {
    if (pecaMovendo.current?.posicao! - 8 === novaPosicao) {
      return true;
    }

    if (
      pecaMovendo.current?.posicao! - 8 * 2 === novaPosicao &&
      pecaMovendo.current?.historico.length === 1
    ) {
      return true;
    }

    return false;
  };

  const podeMoverDiagonal = () => {
    if (
      posicaoSendJogada &&
      validaComerPeao(pecaMovendo.current?.posicao!).includes(
        posicaoSendJogada
      ) &&
      !!pecas.find((item) => item.posicao === posicaoSendJogada)
    ) {
      return true;
    }

    return false;
  };

  const validaSePodeMover = (novaPosicao: number) => {
    if (podeMoverCaminhoReto(novaPosicao) || podeMoverDiagonal()) {
      return true;
    }

    return false;
  };

  return (
    <div>
      <div className="cemiterio">
        {comidos.map((item) => (
          <img draggable={false} src={item.imagem} alt="comido" />
        ))}
      </div>
      <div className="tabuleiro">
        {areas.map((area) => (
          <div
            onDragOver={(ev) => {
              setPosicaoSendJogada(area.posicao);

              ev.preventDefault();
            }}
            onDrop={() => {
              setPosicaoSendJogada(null);

              mover(area.posicao);
            }}
            className={`${
              posicaoSendJogada === area.posicao &&
              pecaMovendo.current?.posicao !== area.posicao
                ? getClassDrop(validaSePodeMover(area.posicao))
                : ""
            } ${getClass(area.cor)}`}
          >
            {retornarPeca(area.posicao)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
