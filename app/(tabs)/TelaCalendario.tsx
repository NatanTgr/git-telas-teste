import { StyleSheet, Text, View, ScrollView, TextInput, Button, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { useState, useEffect } from 'react';
//import { router, Link } from 'expo-router';
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "../../context/ThemeContext";

import { ptBR } from "../../Utils/configCal"

LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

export default function TelaCalendario() {

  const { tema } = useTheme();

  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [professor, setProfessor] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [descricao, setDescricao] = useState('');

  const adicionarTarefa = async (tipo: string) => {

  const novaTarefa = {
    id: Date.now().toString(),
    title: titulo,
    data,
    disciplina,
    professor,
    tipo,
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

  await carregarEventosCalendario();
  };

  //selecionar dia 
  const [selectedDay, setSelectedDay] = useState("");

  //marcar data
  const [markedDates, setMarkedDates] = useState<any>({});

  //não excluir esse const day
  const [day, setDay] = useState<DateData>();

  //aparecer modal quando clicar em um dia
  const [modalVisible, setModalVisible] = useState(false);

  //escolher tipo de tarefa
  const [tipoSelecionado, setTipoSelecionado] = useState('');

  // Adicionar uma nova tarefa
  

   // CLICA NO DIA
  function handleDayPress(day: DateData) {
    setSelectedDay(day.dateString);
    setData(day.dateString);
    setModalVisible(true);
  }

  const carregarEventosCalendario = async () => {
    try {
      const json = await AsyncStorage.getItem("tarefas");

      if (!json) {
        setMarkedDates({});
        return;
      }

      const tarefas = JSON.parse(json);

      const datasMarcadas: any = {};

      tarefas.forEach((tarefa: any) => {

        let cor = "#88C688";

        if (tarefa.tipo === "Reunião") {
          cor = "#94C0DF";
        }

        const data = tarefa.data;

        if (!datasMarcadas[data]) {
          datasMarcadas[data] = {
            dots: [],
          };
        }

        datasMarcadas[data].dots.push({
          key: tarefa.id,
          color: cor,
        });
      });

      setMarkedDates(datasMarcadas);

    } catch (error) {
      console.log(error);
    }
  };

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    carregarEventosCalendario();
  }, []);

  return (
    
    
    <View style={[
      styles.container,
      {
        backgroundColor: tema.background,
      },
    ]}>

      <Text style={[styles.titulo,
      {
        color: tema.text
      }  
      ]}>Calendário</Text>

        <View style={styles.legendaContainer}>

          <View style={styles.legendaItem}>
            <View
              style={[
                styles.quadrado,
                  { backgroundColor: "#FFA64E" }
              ]}
            />

          <Text style={[styles.legenda,
          {
            color: tema.text
          }
          ]}>
            Atrasada</Text>
          </View>

          <View style={styles.legendaItem}>
            <View
              style={[
                styles.quadrado,
                { backgroundColor: "#88C688"  }
              ]}
            />

          <Text style={[styles.legenda,
          {
            color: tema.text
          }
          ]}>
            Tarefa</Text>    
          </View>

          <View style={styles.legendaItem}>
            <View
              style={[
                styles.quadrado,
                { backgroundColor: "#94C0DF"}
              ]}
            />

          <Text style={[styles.legenda,
          {
            color: tema.text
          }
          ]}>
            Reunião</Text>
          </View>

        </View>

      <View style={[styles.calendarContainer,
      {
        backgroundColor: tema.card
      }
      ]}>  
        <Calendar
          style={styles.calendar} 
          renderArrow={( direction: "right" | "left") => (
          <Feather size={24} color="#000000"
          name={`chevron-${direction}`} />
          )}

          headerStyle={{ 
            paddingBottom: 10,
            marginBottom: 10,
          }}
          theme={{
            backgroundColor: "#fff",
            todayTextColor: "#fff",
            todayBackgroundColor: "#836F68",
            monthTextColor: "#000000",
            arrowStyle: {
              margin: 0,
              padding: 0, 
            },
            
            ['stylesheet.day.basic']: {
              base: {
                width: 40,
                height: 40,

                alignItems: 'center',
                justifyContent: 'center',

                borderWidth: 1,
                borderColor: "#cdcdcd85",

                borderRadius: 12,
                
              }
            }
            
          } as any}
          //minDate={new Date().toDateString()}
          hideExtraDays={true}
          onDayPress={handleDayPress}
          markingType={"multi-dot"}
          markedDates={markedDates}
        />
      </View>

      <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
        
          
                  <View style={[styles.cardModal,
                  {backgroundColor: tema.modal}  
                  ]}>
        
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    >
                    <Text style={[styles.tituloModal,
                    {color: tema.text}  
                    ]}>
                      Novo Evento
                    </Text>
                    
                    <Text style={[styles.tipoTexto,
                    {color: tema.text}
                    ]}>Tipo</Text>
        
                    <View style={styles.opcoesRow}>
                    {/* Opção Tarefa */}
                    <TouchableOpacity
                      style={styles.opcaoContainer}
                      onPress={() => setTipoSelecionado('Tarefa')}
                    >
                      <View style={styles.radioExterno}>
                        {tipoSelecionado === 'Tarefa' && (
                          <View style={styles.radioInterno} />
                        )}
                      </View>
        
                      <Text style={[styles.textoOpcao,
                      {color: tema.text}
                      ]}>
                        Tarefa
                      </Text>
                    </TouchableOpacity>
        
                    {/* Opção Reunião */}
                    <TouchableOpacity
                      style={styles.opcaoContainer}
                      onPress={() => setTipoSelecionado('Reunião')}
                    >
                      <View style={styles.radioExterno}>
                        {tipoSelecionado === 'Reunião' && (
                          <View style={styles.radioInterno} />
                        )}
                      </View>
        
                      <Text style={[styles.textoOpcao,
                      {color: tema.text}
                      ]}>
                        Reunião
                      </Text>
                    </TouchableOpacity>
                    </View>
        
                    {/*Colocar Textos*/}
                    <View style={styles.infoTarefa}>
                      <Text style={[styles.titulosInfoTarefa,
                        {color: tema.text}
                      ]}>Título</Text>
                      <TextInput 
                        style={styles.textosInfo}
                        placeholder= "Nome do evento"
                        value={titulo}
                        onChangeText={setTitulo}              
                      >
                      </TextInput>
                      
                      <Text style={[styles.titulosInfoTarefa,
                      {color: tema.text}  
                      ]}>Data Selecionada
                      </Text>
                      <TextInput 
                        style={styles.textosInfo}
                        value={formatarData(data)}
                        editable={false}
                      >
                      </TextInput>
        
                      <Text style={[styles.titulosInfoTarefa,
                      {color: tema.text}
                      ]}>Disciplina</Text>
                      <TextInput 
                        style={styles.textosInfo}
                        placeholder= "Ex: Matemática"
                        value={disciplina}
                        onChangeText={setDisciplina}              
                      >
                      </TextInput>
        
                      <Text style={[styles.titulosInfoTarefa,
                      {color: tema.text}
                      ]}>Professor</Text>
                      <TextInput 
                        style={styles.textosInfo}
                        placeholder= "Nome do professor"
                        value={professor}
                        onChangeText={setProfessor}              
                      >
                      </TextInput>
        
                      <Text style={[styles.titulosInfoTarefa,
                      {color: tema.text}  
                      ]}>Plataforma de Realização</Text>
                      <TextInput 
                        style={styles.textosInfo}
                        placeholder= "Ex: Google Classroom, Moodle"
                        value={plataforma}
                        onChangeText={setPlataforma}              
                      >
                      </TextInput>
        
                      <Text style={[styles.titulosInfoTarefa,
                      {color: tema.text}  
                      ]}>Descrição</Text>
                      <TextInput 
                        style={styles.textosInfo}
                        placeholder= "Detalhes do evento"
                        value={descricao}
                        onChangeText={setDescricao}              
                      >
                      </TextInput>
                    </View>
        
                    {/* Botões */}
                    <View style={styles.botoesModal}>
                
                      <TouchableOpacity
                        style={styles.botaoCancelar}
                        onPress={() => {
                        setModalVisible(false);
                        setTipoSelecionado('');
                        }}
                      >
                        <Text style={{ color: '#fff' }}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>
        
                      <TouchableOpacity
                        style={styles.botaoConfirmar}
                        onPress={async () => {
                          await adicionarTarefa(tipoSelecionado);
                          await carregarEventosCalendario();
                          setModalVisible(false);
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

    </View>
    


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDD0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  calendarContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginTop: 2,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  calendar: {
    borderRadius: 24,
    width: 350,
    padding: 15,
  },

  titulo: {
    paddingBottom: 50,
    fontSize: 50,
    
  },

  legenda: {
    fontSize: 15,
  },

  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  quadrado: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },

  legendaContainer: {
    flexDirection: "row",
    gap: 40,
  },

  buttons: {
    marginTop: 20,
    gap: 10,
  },

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

  tipoTexto: {
    paddingBottom: 15
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

  modalDate: {
  fontSize: 18,
  marginBottom: 20,
  },

});
