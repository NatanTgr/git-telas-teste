import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextType = {
  temaEscuro: boolean;
  alternarTema: () => void;
  carregando: boolean;
  tema: any;
};

const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const tema = temaEscuro
  ? {
      background: "#897272",
      card: "#2A2A2A",
      text: "#FFFDD0",
      secondaryText: "#CCCCCC",
      input: "#333333",
      border: "#444444",
      primary: "#94C0DF",
      modal: "#524c4c"
    }
  : {
      background: "#FFFDD0",
      card: "#FFFFFF",
      text: "#000000",
      secondaryText: "#666666",
      input: "#FFFFFF",
      border: "#DDDDDD",
      primary: "#94C0DF",
      modal: "#fff"
    };

  useEffect(() => {
    carregarTema();
  }, []);

  async function carregarTema() {
    try {
      const temaSalvo = await AsyncStorage.getItem("tema");

      if (temaSalvo !== null) {
        setTemaEscuro(JSON.parse(temaSalvo));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCarregando(false);
    }
  }

  async function alternarTema() {
    try {
      const novoTema = !temaEscuro;

      setTemaEscuro(novoTema);

      await AsyncStorage.setItem(
        "tema",
        JSON.stringify(novoTema)
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        temaEscuro,
        alternarTema,
        carregando,
        tema,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}