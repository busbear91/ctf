export interface Team {
  id: string
  name: string
  join_code: string
  score: number
  created_at: string
}

export interface Challenge {
  id: number
  title: string
  scenario: string
  task: string
  artifact: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  points: number
  hint: string
  flag: string
  is_visible: boolean
  created_at: string
}

export interface Submission {
  id: string
  team_id: string
  challenge_id: number
  flag_submitted: string
  is_correct: boolean
  submitted_at: string
  teams?: { name: string }
  challenges?: { title: string; points: number }
}

export interface GameState {
  id: number
  timer_running: boolean
  start_time: string | null
  duration_minutes: number
  leaderboard_visible: boolean
  leaderboard_snapshot: LeaderboardEntry[] | null
}

export interface LeaderboardEntry {
  team_id: string
  team_name: string
  score: number
  solves: number
  last_solve_at: string | null
}

export interface TeamSession {
  teamId: string
  teamName: string
}
