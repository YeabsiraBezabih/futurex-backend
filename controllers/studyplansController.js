const db = require('../database/db');

const getStudyPlans = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = `
      SELECT sp.*, 
             COALESCE(SUM(ss.duration), 0) as total_study_time
      FROM StudyPlans sp
      LEFT JOIN StudySessions ss ON sp.id = ss.study_plan_id
      WHERE sp.user_id = $1
      GROUP BY sp.id
      ORDER BY sp.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error getting study plans:', err);
    res.status(500).json({ error: 'Failed to retrieve study plans' });
  }
};

const createStudyPlan = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      title, 
      description, 
      start_date, 
      end_date, 
      focus_duration = 1500,  // 25 minutes default
      break_duration = 300    // 5 minutes default
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const query = `
      INSERT INTO StudyPlans (
        user_id, title, description, start_date, end_date, 
        focus_duration, break_duration
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    
    const result = await db.query(query, [
      userId, title, description, start_date, end_date,
      focus_duration, break_duration
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating study plan:', err);
    res.status(500).json({ error: 'Failed to create study plan' });
  }
};

const updateStudySession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { completed_duration, session_type } = req.body;

    const updateQuery = `
      UPDATE StudyPlans 
      SET 
        sessions_completed = sessions_completed + 1,
        total_focus_time = total_focus_time + $1
      WHERE id = $2 AND user_id = $3 
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, [completed_duration, id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Study plan not found or not authorized' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating study session:', err);
    res.status(500).json({ error: 'Failed to update study session' });
  }
};

const getStudyPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const query = `
      SELECT sp.*, 
             COALESCE(SUM(ss.duration), 0) as total_study_time
      FROM StudyPlans sp
      LEFT JOIN StudySessions ss ON sp.id = ss.study_plan_id
      WHERE sp.id = $1 AND sp.user_id = $2
      GROUP BY sp.id
    `;
    const result = await db.query(query, [id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Study plan not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error getting study plan:', err);
    res.status(500).json({ error: 'Failed to retrieve study plan' });
  }
};

const deleteStudyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const query = 'DELETE FROM StudyPlans WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(query, [id, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Study plan not found or not authorized to delete' });
    }
    res.status(200).json({ message: 'Study plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting study plan:', err);
    res.status(500).json({ error: 'Failed to delete study plan' });
  }
};

module.exports = {
    getStudyPlans,
    createStudyPlan,
    getStudyPlanById,
    updateStudySession,
    deleteStudyPlan
};
