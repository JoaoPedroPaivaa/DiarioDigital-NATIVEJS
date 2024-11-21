import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { saveDiary, getDiaries, deleteDiary, updateDiary } from '../services/diaryService';
import { auth } from '../services/firebaseConfig';
import EmojiPicker from 'react-native-emoji-picker';

const DiaryScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('😊');
  const [diaries, setDiaries] = useState([]);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleSaveDiary = async () => {
    const userId = auth.currentUser.uid;
    await saveDiary(userId, title, content, new Date().toLocaleDateString(), emoji);
    setTitle('');
    setContent('');
    setEmoji('😊');
    loadDiaries();
  };

  const loadDiaries = async () => {
    const userId = auth.currentUser.uid;
    const userDiaries = await getDiaries(userId);
    setDiaries(userDiaries);
  };

  useEffect(() => {
    loadDiaries();
  }, []);

  const handleDeleteDiary = async (diaryId) => {
    await deleteDiary(diaryId);
    loadDiaries();
  };

  const handleEditDiary = async (diaryId) => {
    await updateDiary(diaryId, { title, content, emoji });
    setTitle('');
    setContent('');
    setEmoji('😊');
    loadDiaries();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Diário</Text>

      {/* Formulário */}
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* Seletor de Emoji */}
      <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.emojiSelector}>
        <Text style={styles.emojiText}>Emoji: {emoji}</Text>
      </TouchableOpacity>
      {isPickerVisible && (
        <EmojiPicker
          onEmojiSelected={(e) => {
            setEmoji(e);
            setPickerVisible(false);
          }}
          visible={isPickerVisible}
        />
      )}

      <Button title="Salvar Diário" onPress={handleSaveDiary} />

      {/* Lista de diários */}
      <ScrollView style={styles.diaryList}>
        {diaries.map((diary) => (
          <View key={diary.id} style={styles.diaryItem}>
            <Text style={styles.diaryTitle}>
              {diary.title} {diary.emoji}
            </Text>
            <Text>{diary.content}</Text>
            <Text style={styles.date}>{diary.date}</Text>
            <View style={styles.actions}>
              <Button
                title="Editar"
                onPress={() => {
                  setTitle(diary.title);
                  setContent(diary.content);
                  setEmoji(diary.emoji);
                  handleEditDiary(diary.id);
                }}
              />
              <Button
                title="Excluir"
                onPress={() => handleDeleteDiary(diary.id)}
                color="red"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  emojiSelector: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ececec',
    borderRadius: 5,
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 18,
  },
  diaryList: {
    marginTop: 20,
  },
  diaryItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  diaryTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default DiaryScreen;
