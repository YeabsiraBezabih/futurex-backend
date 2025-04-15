const db = require('../database/db');

const getAllQuizzes = (req, res) => {
  const sql = 'SELECT * FROM Quiz';
  
  db.query(sql)
    .then(([results]) => {
      res.status(200).json(results);
    })
    .catch(err => {
      console.error('Error getting all quizzes:', err);
      res.status(500).json({ error: 'Failed to retrieve quizzes' });
    });
};

const getQuizById = (req, res) => {
  const quizId = req.params.id;

  const quizQuery = 'SELECT * FROM Quiz WHERE id = ?';
  const questionsQuery = 'SELECT * FROM QuizQuestions WHERE quiz_id = ?';

  db.query(quizQuery, [quizId])
    .then(([quizResults]) => {
      if (quizResults.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      return db.query(questionsQuery, [quizId])
        .then(([questionsResults]) => {
          const quiz = quizResults[0];
          quiz.questions = questionsResults.map(question => ({
            id: question.id,
            question: question.question,
            options: JSON.parse(question.options),
            correct_answer: question.correct_answer
          }));
          res.status(200).json(quiz);
        });
    })
    .catch(err => {
      console.error('Error getting quiz:', err);
      res.status(500).json({ error: 'Failed to retrieve quiz' });
    });
};

const createQuiz = (req, res) => {
  const { title, description, language_id, difficulty_level, questions } = req.body;

  if (!title || !description || !language_id || !difficulty_level || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      error: 'Title, description, language_id, difficulty_level, and questions are required. Questions must be a non-empty array.'
    });
  }

  const quizSql = 'INSERT INTO Quiz (title, description, language_id, difficulty_level) VALUES (?, ?, ?, ?)';
  
  db.query(quizSql, [title, description, language_id, difficulty_level])
    .then(([result]) => {
      const quizId = result.insertId;
      const questionValues = questions.map(q => [
        quizId,
        q.question,
        q.correct_answer,
        JSON.stringify(q.options)
      ]);

      const questionsSql = 'INSERT INTO QuizQuestions (quiz_id, question, correct_answer, options) VALUES ?';
      return db.query(questionsSql, [questionValues])
        .then(() => {
          res.status(201).json({
            message: 'Quiz created successfully',
            quizId: quizId
          });
        });
    })
    .catch(err => {
      console.error('Error creating quiz:', err);
      res.status(500).json({ error: 'Failed to create quiz' });
    });
};

const deleteQuiz = (req, res) => {
  const quizId = req.params.id;

  const sql = 'DELETE FROM Quiz WHERE id = ?';
  
  db.query(sql, [quizId])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      res.status(200).json({ message: 'Quiz deleted successfully' });
    })
    .catch(err => {
      console.error('Error deleting quiz:', err);
      res.status(500).json({ error: 'Failed to delete quiz' });
    });
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  deleteQuiz
};
