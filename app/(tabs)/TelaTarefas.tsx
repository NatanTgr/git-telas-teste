// Importando componentes e recursos
import { useEffect, useState } from "react";
import {
  View, ScrollView, Text, TextInput, Modal, TouchableOpacity,
  FlatList, Keyboard, Alert, StyleSheet, Button} from 'react-native';


import { Ionicons } from '@expo/vector-icons';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Definindo o tipo para uma tarefa
type Task = {
  id: string;
  title: string;
  data: string;
  disciplina: string;
  professor: string;
  tipo: string;
  plataforma: string;
  descricao: string;
  completed: boolean;

};


export default function ListaTarefas() {
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [descricaoTarefa, setDescricaoTarefa] = useState('');

  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState('');

  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [descricao, setDescricao] = useState('');

  //modal quando clica no card
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Task | null>(null);
 
  // Adicionar uma nova tarefa
  const adicionarTarefa = async () => {
    const novaTarefa: Task = {
      id: Date.now().toString(),
      title: titulo,
      data: dataInterna,
      disciplina,
      professor,
      tipo: tipoSelecionado,
      plataforma,
      descricao,
      completed: false,
    };

    const json = await AsyncStorage.getItem('tarefas');
    const tarefasExistentes = json
      ? JSON.parse(json)
      : [];

    tarefasExistentes.push(novaTarefa);

    await AsyncStorage.setItem(
      'tarefas',
      JSON.stringify(tarefasExistentes)
    );

    setTarefas([...tarefas, novaTarefa]);

    setTitulo('');
    setData('');
    setDisciplina('');
    setProfessor('');
    setPlataforma('');
    setDescricao('');
    setTipoSelecionado('');
  

    console.log("Tarefa adicionada");
  };
  
  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case "Tarefa":
        return "#88C688"; // verde
      case "Reunião":
        return "#94C0DF"; // azul
      default:
        return "#94C0DF";
    }
  };

  //Formata a data 
  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Renderizar cada item da lista
  const renderizarTarefas = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={[Estilos.cardEvento,
        { borderColor: getCorTipo(item.tipo)}
      ]}
      onPress={() => {
        setTarefaSelecionada(item);
        setModalDetalhes(true);
      }}
    >
      <View style={Estilos.topoCard}>
        <TouchableOpacity
          style={Estilos.checkbox}
          onPress={() => alterarStatusTarefa(item.id)}
        >
          {item.completed ? (
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          ) : (
            <Ionicons name="ellipse-outline" size={24} color="#ccc" />
          )}
        </TouchableOpacity>
     
        <Text
          style={[
            Estilos.tituloEvento,
            item.completed && Estilos.completedTaskText
          ]}
        >
          {item.title}
        </Text>

        <View 
          style={[Estilos.badgeTipo,
            { backgroundColor: getCorTipo(item.tipo) }
          ]}
        >
          <Text style={Estilos.textoTipo}>
            {item.tipo}
          </Text>
        </View>
      </View>

      <Text>
        📅 {formatarData(item.data)} -  📚 {item.disciplina}
      </Text>

      <Text>
        👨‍🏫 Prof. {item.professor}
      </Text>
      
    </TouchableOpacity>
  );


  // Alternar o status de conclusão de uma tarefa
  const alterarStatusTarefa = (id: string) => {
    setTarefas(
      tarefas.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };


  // Remover uma tarefa
  const removerTarefa = (id: string) => {
    Alert.alert(
      'Remover Tarefa',
      'Tem certeza que deseja remover esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          onPress: () => {
            setTarefas(tarefas.filter(task => task.id !== id));
          }
        }
      ]
    );
  };


  // Contadores para estatísticas
  const totalTarefas = tarefas.length;
  const tarefasCompletas = tarefas.filter(task => task.completed).length;


  // Salva as tarefas na memória interna
  const storeData = async (conteudo: any) => {
    try {
      const jsonValue = JSON.stringify(conteudo);
      await AsyncStorage.setItem('tarefas', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };


  // Recupera as informações salvas
  const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('tarefas');
               
        if(jsonValue != null) {
          console.log(JSON.parse(jsonValue));
          setTarefas(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.log(e);
      }
  };

  //converter data
  const converterData = (data: string) => {
    const [ano, mes, dia] = data.split("-");

    return new Date(
      Number(ano),
      Number(mes) - 1,
      Number(dia)
    );
  };

  //para o textInput da data funcionar
  const alterarData = (texto: string) => {
    let valor = texto.replace(/\D/g, "");

    if (valor.length > 8) valor = valor.slice(0, 8);

    if (valor.length > 4) {
      valor =
        valor.slice(0, 2) +
        "/" +
        valor.slice(2, 4) +
        "/" +
        valor.slice(4);
    } else if (valor.length > 2) {
      valor =
        valor.slice(0, 2) +
        "/" +
        valor.slice(2);
    }

    setData(valor);

    if (valor.length === 10) {
      const [dia, mes, ano] = valor.split("/");
      setDataInterna(`${ano}-${mes}-${dia}`);
    }
  };

  //o que sera salvo
  const [dataInterna, setDataInterna] = useState("");

  //cria a data de hoje
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  //cria os quatro arrays
  const atrasadas: Task[] = [];
  const hojeLista: Task[] = [];
  const semana: Task[] = [];
  const proximas: Task[] = [];
  const concluidas: Task[] = [];

  //separar as tarefas
  tarefas.forEach((tarefa) => {

  // Se estiver concluída, vai direto para a lista de concluídas
  if (tarefa.completed) {
    concluidas.push(tarefa);
    return;
  }
    const data = converterData(tarefa.data);

    data.setHours(0, 0, 0, 0);

    const diferencaDias =
      (data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);

    console.log(tarefa.data)

    if (diferencaDias < 0) {
      atrasadas.push(tarefa);
    } else if (diferencaDias === 0) {
      hojeLista.push(tarefa);
    } else if (diferencaDias <= 7) {
      semana.push(tarefa);
    } else {
      proximas.push(tarefa);
    }
  });

  //funçao para  renderizar cada seção
  const renderizarSecao = (titulo: string, dados: Task[]) => {
    if (dados.length === 0) return null;

    return (
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 10,
            marginLeft: 5,
          }}
        >
          {titulo}
        </Text>

        {dados.map((item) => (
          <View key={item.id}>
            {renderizarTarefas({ item })}
          </View>
        ))}
      </View>
    );
  };

      // Toda vez que o app for iniciado os dados salvos serão carregados
    useEffect(() => {
      getData();
    }, []);


   // Toda vez que lista de tarefas mudar, salvar localmente
    useEffect(() => {
      storeData(tarefas);
    }, [tarefas]);


  return(
    <View style={Estilos.container}>
      {/* Cabeçalho */}
      <View style={Estilos.header}>
        <View style={Estilos.topRow}>
          <Text style={Estilos.headerTitle}>Minhas Tarefas</Text>
        
          <TouchableOpacity 
          style={Estilos.addButton} 
          onPress={() => setModalVisivel(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={Estilos.taskCount}>
            {tarefasCompletas} de {totalTarefas} concluídas
          </Text>

      </View>


     {/* Area com a lista de tarefas */}
      {tarefas.length > 0 ? (
        <ScrollView
          style={Estilos.taskList}
          showsVerticalScrollIndicator={false}
        >

        {renderizarSecao("⚠️ Atrasadas", atrasadas)}

        {renderizarSecao("📅 Hoje", hojeLista)}

        {renderizarSecao("🗓️ Esta Semana", semana)}

        {renderizarSecao("📌 Próximas Atividades", proximas)}

        {renderizarSecao("✅ Concluídas", concluidas)}

        </ScrollView>
      ) : (
        <View style={Estilos.emptyState}>
          <Ionicons name="checkmark-done-outline" size={64} color="#e0e0e0" />
          <Text style={Estilos.emptyStateText}>
            Nenhuma tarefa adicionada
          </Text>
          <Text style={Estilos.emptyStateSubtext}>
            Adicione uma tarefa para começar!
          </Text>
        </View>
      )}

      <Modal
        transparent={true}
        visible={modalVisivel}
        animationType="fade"
      >
        <View style={Estilos.modalOverlay}>

  
          <View style={Estilos.cardModal}>

            <ScrollView
            showsVerticalScrollIndicator={false}
            >
            <Text style={Estilos.tituloModal}>
              Novo Evento
            </Text>

            
            <Text style={{paddingBottom: 15,}}>Tipo</Text>

            <View style={Estilos.opcoesRow}>
            {/* Opção Tarefa */}
            <TouchableOpacity
              style={Estilos.opcaoContainer}
              onPress={() => setTipoSelecionado('Tarefa')}
            >
              <View style={Estilos.radioExterno}>
                {tipoSelecionado === 'Tarefa' && (
                  <View style={Estilos.radioInterno} />
                )}
              </View>

              <Text style={Estilos.textoOpcao}>
                Tarefa
              </Text>
            </TouchableOpacity>

            {/* Opção Reunião */}
            <TouchableOpacity
              style={Estilos.opcaoContainer}
              onPress={() => setTipoSelecionado('Reunião')}
            >
              <View style={Estilos.radioExterno}>
                {tipoSelecionado === 'Reunião' && (
                  <View style={Estilos.radioInterno} />
                )}
              </View>

              <Text style={Estilos.textoOpcao}>
                Reunião
              </Text>
            </TouchableOpacity>
            </View>

            {/*Colocar Textos*/}
            <View style={Estilos.infoTarefa}>
              <Text style={Estilos.titulosInfoTarefa}>Título</Text>
              <TextInput 
                style={Estilos.textosInfo}
                placeholder= "Nome do evento"
                value={titulo}
                onChangeText={setTitulo}              
              >
              </TextInput>
              
              <Text style={Estilos.titulosInfoTarefa}>Data</Text>
              <TextInput 
                style={Estilos.textosInfo}
                placeholder= "dd/mm/aaaa"
                value={data}
                onChangeText={alterarData}
                keyboardType="numeric"              
                maxLength={10}
              >
              </TextInput>

              <Text style={Estilos.titulosInfoTarefa}>Disciplina</Text>
              <TextInput 
                style={Estilos.textosInfo}
                placeholder= "Ex: Matemática"
                value={disciplina}
                onChangeText={setDisciplina}
              >
              </TextInput>

              <Text style={Estilos.titulosInfoTarefa}>Professor</Text>
              <TextInput 
                style={Estilos.textosInfo}
                placeholder= "Nome do professor"
                value={professor}
                onChangeText={setProfessor}
              >
              </TextInput>

              <Text style={Estilos.titulosInfoTarefa}>Plataforma de Realização</Text>
              <TextInput 
                style={Estilos.textosInfo}
                placeholder= "Ex: Google Classroom, Moodle"
                value={plataforma}
                onChangeText={setPlataforma}
              >
              </TextInput>

              <Text style={Estilos.titulosInfoTarefa}>Descrição</Text>
              <TextInput 
                style={Estilos.textosInfo}
                placeholder= "Detalhes do evento"
                value={descricao}
                onChangeText={setDescricao}
              >
              </TextInput>
            </View>

            {/* Botões */}
            <View style={Estilos.botoesModal}>
        
              <TouchableOpacity
                style={Estilos.botaoCancelar}
                onPress={() => {
                setModalVisivel(false);
                setTipoSelecionado('');
                }}
              >
                <Text style={{ color: '#fff' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={Estilos.botaoConfirmar}
                onPress={() => {
                  setModalVisivel(false);
                  adicionarTarefa();
                }}
              >
                <Text style={{ color: '#ffffff' }}>
                  Adicionar Evento
                </Text>
              </TouchableOpacity>

            </View>
          </ScrollView>        
          </View>
        
        </View>
      </Modal>
      
      <Modal
        visible={modalDetalhes}
        transparent
        animationType="fade"
      >
        <View style={Estilos.modalOverlay}>

          <View style={Estilos.cardModal}>

            <Text style={Estilos.tituloModal}>
              Detalhes do Evento
            </Text>

            <Text>
              <Text style={{ fontWeight: 'bold' }}>Título</Text>{" "}
              {tarefaSelecionada?.title}
            </Text>

            <Text>
            <Text style={{ fontWeight: 'bold' }}>Data</Text>{" "}
              {tarefaSelecionada?.data}
            </Text>

            <Text>
            <Text style={{ fontWeight: 'bold' }}>Disciplina</Text>{" "}
              {tarefaSelecionada?.disciplina}
            </Text>

            <Text>
            <Text style={{ fontWeight: 'bold' }}>Professor</Text>{" "}
              {tarefaSelecionada?.professor}
            </Text>

            <Text>
            <Text style={{ fontWeight: 'bold' }}>Tipo</Text>{" "}
              {tarefaSelecionada?.tipo}
            </Text>

            <Text>
            <Text style={{ fontWeight: 'bold' }}>Plataforma</Text>{" "}
              {tarefaSelecionada?.plataforma}
            </Text>

            <Text>
            <Text style={{ fontWeight: 'bold' }}>Descrição</Text>{" "}
              {tarefaSelecionada?.descricao}
            </Text>

            <TouchableOpacity
              style={Estilos.botaoConfirmar}
              onPress={() => setModalDetalhes(false)}
            >
            <Text style={{ color: '#fff' }}>
              Fechar
            </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={Estilos.deleteButton}
              onPress={() => {
                if (tarefaSelecionada) {
                  removerTarefa(tarefaSelecionada.id);
                  setModalDetalhes(false);
                }
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#ff3b30" />
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </View>
  )}


  // Área de estilização visual dos componentes de tela


const Estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDD0',
  },

  header: {
    padding: 20,
    marginTop: 40,
  },

  topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },

  taskCount: {
    fontSize: 14,
    color: '#666',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
  },

  addButton: {
    backgroundColor: '#94C0DF',
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  taskList: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 0,
    paddingTop: 0,
  },

  cardEvento: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  checkbox: {
    marginRight: 12,
  },

  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  deleteButton: {
    padding: 8,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },

  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },


  /*Parte feita com IA até o BotaoConfirmar*/
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  },

  scrollModal: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardModal: {
    width: '85%',
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
  },

  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  opcaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    },

  opcoesRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  radioExterno: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B6CB7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  radioInterno: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4B6CB7',
  },

  textoOpcao: {
    fontSize: 16,
  },

  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  botaoCancelar: {
    backgroundColor: '#FFAA56',
    padding: 12,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },

  botaoConfirmar: {
    backgroundColor: '#94C0DF',
    padding: 12,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },


  infoTarefa: {
    gap: 10,
  },

  textosInfo: {
    borderWidth: 1,
    borderColor: "#dbdbdb",
    borderRadius: 10,

  },

  titulosInfoTarefa: {
    marginTop: 20,
  },

  buttons: {
    marginBottom: 50,
    alignItems: "center",   
  },

  topoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  tituloEvento: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },

  badgeTipo: {
    backgroundColor: "#94C0DF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },

  textoTipo: {
    color: "#fff",
    fontWeight: "bold",
  },
});
