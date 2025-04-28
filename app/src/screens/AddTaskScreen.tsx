/**
 * AddTaskScreen.tsx
 * 
 * Tela responsável por criar novas tarefas.
 * Permite ao usuário definir:
 * - Título da tarefa
 * - Descrição
 * - Data e hora
 * - Nível de urgência
 * - Se é uma tarefa para o dia todo
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, addDoc, Timestamp, DocumentData } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useTheme } from '../hooks/useTheme';
import { useNotifications } from '../contexts/NotificationContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Interface que define os níveis de urgência possíveis
 */
type UrgencyLevel = 'baixa' | 'media' | 'alta' | 'urgente';

/**
 * Interface que define a estrutura de uma tarefa
 */
interface Task extends DocumentData {
  title: string;
  description: string;
  urgency: UrgencyLevel;
  dueDate: Timestamp;
  isFullDay: boolean;
  startTime: string | null;
  endTime: string | null;
  userId: string;
  completed: boolean;
  createdAt: Timestamp;
}

const urgencyOptions = [
  { value: 'baixa', label: 'Baixa', color: '#4CAF50' },
  { value: 'media', label: 'Média', color: '#FFC107' },
  { value: 'alta', label: 'Alta', color: '#FF9800' },
  { value: 'urgente', label: 'Urgente', color: '#F44336' },
];

export default function AddTaskScreen() {
  const theme = useTheme();
  const { scheduleTaskNotification } = useNotifications();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('baixa');
  const [dueDate, setDueDate] = useState(new Date());
  const [isFullDay, setIsFullDay] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Date/Time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a tarefa');
      return;
    }

    if (!isFullDay && (!startTime || !endTime)) {
      Alert.alert('Erro', 'Por favor, defina o horário da tarefa');
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser?.uid) {
        throw new Error('Usuário não autenticado');
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: Timestamp.fromDate(dueDate),
        startTime: isFullDay ? null : startTime,
        endTime: isFullDay ? null : endTime,
        isFullDay,
        urgency,
        completed: false,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
      };

      const tasksCollection = collection(db, 'tasks');
      await addDoc(tasksCollection, taskData);
      
      // Agendar notificação
      await scheduleTaskNotification(taskData.id, title.trim(), dueDate);

      Alert.alert('Sucesso', 'Tarefa criada com sucesso', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || new Date();
    setShowStartTimePicker(false);
    if (event.type === 'set') {
      if (event.nativeEvent.timestamp === 0) {
        setStartTime(format(currentTime, 'HH:mm'));
      } else {
        setEndTime(format(currentTime, 'HH:mm'));
      }
    }
  };

  const toggleFullDay = () => {
    setIsFullDay(!isFullDay);
    if (!isFullDay) {
      setStartTime('');
      setEndTime('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar 
        backgroundColor={theme.colors.background} 
        barStyle='dark-content' 
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Tarefa</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Título */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Digite o título da tarefa"
            placeholderTextColor={theme.colors.text + '70'}
          />
        </View>

        {/* Descrição */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Digite a descrição da tarefa"
            placeholderTextColor={theme.colors.text + '70'}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Urgência */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Urgência</Text>
          <View style={styles.urgencyOptions}>
            {urgencyOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.urgencyOption,
                  { 
                    backgroundColor: urgency === option.value ? option.color : 'transparent',
                    borderColor: option.color
                  }
                ]}
                onPress={() => setUrgency(option.value as UrgencyLevel)}
              >
                <Text style={[
                  styles.urgencyOptionText,
                  { color: urgency === option.value ? '#FFF' : option.color }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Data */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Data</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Horários */}
        {!isFullDay && (
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Horários</Text>
            <View style={styles.timePickersContainer}>
              <View style={styles.timePicker}>
                <Text style={styles.formLabel}>Início</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={styles.dateText}>{startTime || '00:00'}</Text>
                  <Ionicons name="time-outline" size={20} color={theme.colors.text} />
                </TouchableOpacity>
                
                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime ? new Date(`2000/01/01 ${startTime}`) : new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>

              <View style={styles.timePicker}>
                <Text style={styles.formLabel}>Término</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={styles.dateText}>{endTime || '00:00'}</Text>
                  <Ionicons name="time-outline" size={20} color={theme.colors.text} />
                </TouchableOpacity>
                
                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime ? new Date(`2000/01/01 ${endTime}`) : new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </View>
            </View>
          </View>
        )}

        {/* Dia todo */}
        <View style={styles.formGroup}>
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={toggleFullDay}
          >
            <View style={[
              styles.checkbox,
              isFullDay && styles.checkboxChecked
            ]}>
              {isFullDay && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>Dia todo</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>Salvar Tarefa</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  urgencyOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  urgencyOption: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyOptionText: {
    fontWeight: '500',
    fontSize: 14,
  },
  timePickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePicker: {
    width: '48%',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 