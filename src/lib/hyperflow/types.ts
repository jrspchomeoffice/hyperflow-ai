export type Exercise = {
  id: string;
  name: string;
  group: string;
  muscle: string;
  videoUrl: string;
  equivalentId: string | null;
  cue: string;
  steps: string[];
  mistakes: string[];
};

export type PlannedSet = {
  reps: number;
  previous: string;
};

export type PlannedExercise = {
  exerciseId: string;
  sets: PlannedSet[];
  restSeconds: number;
};

export type DayPlan = {
  id: string;
  label: string;
  focus: string;
  estimatedMinutes: string;
  exercises: PlannedExercise[];
};

export type Routine = {
  id: string;
  name: string;
  createdAt: string;
  mesocycle: string;
  week: number;
  totalWeeks: number;
  days: DayPlan[];
};

export type SetLog = {
  weight: string;
  done: boolean;
};

/** key: `${dayId}:${exerciseId}:${setIndex}` */
export type WorkoutLog = Record<string, SetLog>;

export type AdminConfig = {
  apiKey: string;
  model: string;
  systemPrompt: string;
};

export type Anamnesis = {
  name: string;
  age: string;
  weight: string;
  height: string;
  level: "iniciante" | "intermediario" | "avancado";
  goal: string;
  daysPerWeek: string;
  restrictions: string;
};
