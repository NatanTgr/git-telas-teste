import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Button} from "react-native";
import { router, Link } from 'expo-router';
import { useTheme } from "../../context/ThemeContext";

export default function TelaConfig() {
  const {
    temaEscuro,
    alternarTema,
  } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: temaEscuro
            ? "#897272"
            : "#FFFDD0",
        },
      ]}
    >
      <Text style={styles.titulo}>
        Configurações
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.tela}>
      
      
      <View style={styles.cardPerfil}>
        <Text style={styles.texto}>
          Perfil do Aluno
        </Text>
        <Text style={styles.texto2}>
          Tipo da conta: Estudante e etc...
        </Text>
      </View>

      <View style={styles.cardTutorial}>
        <Text style={styles.texto}>
          Vídeo Tutorial
        </Text>
      </View>

      <View style={styles.cardConfig}>
        <Text> Configurações</Text>

        <View style={styles.cardTema}>
          <Text style={styles.texto}>
            Tema Escuro
          </Text>

          <Switch
            value={temaEscuro}
            onValueChange={alternarTema}
          />
        </View>

        <View style={styles.cardOpcoes}>
          <Text style={styles.texto}>
            Outras Opções
          </Text>

          
        </View>

        <View style={styles.cardNotiChat}>
          <Text style={styles.texto}>
            Notificações de Chat
          </Text>

          <Switch
            value={temaEscuro}
            onValueChange={alternarTema}
          />
        </View>

        <View style={styles.cardLembrete}>
          <Text style={styles.texto}>
            Lembretes de Tarefas
          </Text>

          <Switch
            value={temaEscuro}
            onValueChange={alternarTema}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.botaoSair}>
        <Text style= {styles.textoBotaoSair}>Sair da conta</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tela: {
    gap: 20,
    padding: 15,
  },

  titulo: {
    marginTop: 50,
    marginBottom: 30,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },

  cardPerfil: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    flexDirection: "column",
    elevation: 5,
  },

  cardTutorial: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  cardConfig: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    gap: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  cardTema: {
    backgroundColor: "#FFFDD0",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  cardOpcoes: {
    backgroundColor: "#FFFDD0",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  cardNotiChat: {
    backgroundColor: "#FFFDD0",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  cardLembrete: {
    backgroundColor: "#FFFDD0",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 5,
  },

  botaoSair: {
    backgroundColor: "#fe0505",
    borderRadius: 15,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },

  textoBotaoSair: {
    color: "#fff",
    fontSize: 18,
  },

  texto: {
    fontSize: 18,
  },

  texto2: {
    fontSize: 18,
  },

  navbar: {
    marginBottom: 50,
    alignItems: "center",   
  },
});