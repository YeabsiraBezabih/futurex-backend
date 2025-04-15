const db = require('../database/db');

const addQuiz = (req, res) => {
    const { title, description, questions } = req.body;
    if (!title || !description || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Title, description, and questions are required and questions must be a non-empty array' });
    }

    const quizData = { title, description };

    db.query('INSERT INTO quizzes SET ?', quizData, (err, result) => {
        if (err) {
            console.error('Error adding quiz:', err);
            return res.status(500).json({ error: 'Failed to add quiz' });
        }

        const quizId = result.insertId;

        const questionValues = questions.map(question => [
            quizId,
            question.questionText,
            JSON.stringify(question.options),
            question.correctAnswer
        ]);

        const questionQuery = 'INSERT INTO questions (quiz_id, question_text, options, correct_answer) VALUES ?';

        db.query(questionQuery, [questionValues], (err, result) => {
            if (err) {
                console.error('Error adding questions:', err);
                // Consider deleting the quiz if adding questions fails
                db.query('DELETE FROM quizzes WHERE id = ?', quizId);
                return res.status(500).json({ error: 'Failed to add questions' });
            }
            res.status(201).json({ message: 'Quiz added successfully', quizId: quizId });
        });
    });
};

const getAllQuizzes = (req, res) => {
    db.query('SELECT * FROM quizzes', (err, results) => {
        if (err) {
            console.error('Error getting all quizzes:', err);
            return res.status(500).json({ error: 'Failed to retrieve quizzes' });
        }
        res.status(200).json(results);
    });
};

const getQuizById = (req, res) => {
    const quizId = req.params.id;

    const quizQuery = 'SELECT * FROM quizzes WHERE id = ?';
    const questionsQuery = 'SELECT * FROM questions WHERE quiz_id = ?';

    db.query(quizQuery, [quizId], (err, quizResult) => {
        if (err) {
            console.error('Error getting quiz:', err);
            return res.status(500).json({ error: 'Failed to retrieve quiz' });
        }

        if (quizResult.length === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        db.query(questionsQuery, [quizId], (err, questionsResult) => {
            if (err) {
                console.error('Error getting questions:', err);
                return res.status(500).json({ error: 'Failed to retrieve questions' });
            }

            const quiz = quizResult[0];
            quiz.questions = questionsResult.map(question => ({
                id: question.id,
                questionText: question.question_text,
                options: JSON.parse(question.options),
                correctAnswer: question.correct_answer
            }));

            res.status(200).json(quiz);
        });
    });
};

const deleteQuiz = (req, res) => {
    const quizId = req.params.id;

    // First, delete questions associated with the quiz
    db.query('DELETE FROM questions WHERE quiz_id = ?', [quizId], (err, result) => {
        if (err) {
            console.error('Error deleting questions:', err);
            return res.status(500).json({ error: 'Failed to delete questions' });
        }

        // Then, delete the quiz itself
        db.query('DELETE FROM quizzes WHERE id = ?', [quizId], (err, result) => {
            if (err) {
                console.error('Error deleting quiz:', err);
                return res.status(500).json({ error: 'Failed to delete quiz' });
            }
            res.status(200).json({ message: 'Quiz deleted successfully' });
        });
    });
};

  module.exports = {
    addQuiz,
    getAllQuizzes,
    getQuizById,
    deleteQuiz,
  };
