import { firestore } from './firebaseConfig'; // Certifique-se de que está importando o firestore configurado corretamente
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

/**
 * Salva um novo diário no Firestore.
 * @param {string} userId - ID do usuário logado.
 * @param {string} title - Título do diário.
 * @param {string} content - Conteúdo do diário.
 * @param {string} date - Data do diário.
 * @param {string} emoji - Emoji selecionado pelo usuário.
 */
export const saveDiary = async (userId, title, content, date, emoji) => {
  try {
    const diaryCollection = collection(firestore, 'diaries');
    await addDoc(diaryCollection, { userId, title, content, date, emoji });
  } catch (error) {
    console.error('Erro ao salvar o diário:', error);
    throw error;
  }
};

/**
 * Carrega todos os diários de um usuário específico do Firestore.
 * @param {string} userId - ID do usuário logado.
 * @returns {Promise<Array>} - Lista de diários do usuário.
 */
export const getDiaries = async (userId) => {
  try {
    const diaryCollection = collection(firestore, 'diaries');
    const userDiariesQuery = query(diaryCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(userDiariesQuery);

    const diaries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return diaries;
  } catch (error) {
    console.error('Erro ao carregar os diários:', error);
    throw error;
  }
};

/**
 * Exclui um diário específico do Firestore.
 * @param {string} diaryId - ID do diário a ser excluído.
 */
export const deleteDiary = async (diaryId) => {
  try {
    const diaryDoc = doc(firestore, 'diaries', diaryId);
    await deleteDoc(diaryDoc);
  } catch (error) {
    console.error('Erro ao excluir o diário:', error);
    throw error;
  }
};

/**
 * Atualiza um diário específico no Firestore.
 * @param {string} diaryId - ID do diário a ser atualizado.
 * @param {Object} updatedFields - Campos a serem atualizados (title, content, emoji, etc.).
 */
export const updateDiary = async (diaryId, updatedFields) => {
  try {
    const diaryDoc = doc(firestore, 'diaries', diaryId);
    await updateDoc(diaryDoc, updatedFields);
  } catch (error) {
    console.error('Erro ao atualizar o diário:', error);
    throw error;
  }
};
