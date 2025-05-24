
// Options for select fields in the class form
export const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", 
  "Maio", "Junho", "Julho", "Agosto", 
  "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const PERIODS = [
  "Matutino", "Vespertino", "Noturno", "Final de Semana"
];

// Default values for the form
export const DEFAULT_FORM_VALUES = {
  courseName: "",
  courseSlug: "",
  image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3",
  month: "",
  year: "",
  period: "",
  startDate: undefined,
  endDate: undefined,
  days: "",
  time: "",
  location: "",
  spotsAvailable: 15,
  totalSpots: 15,
  price: "",
  instructor: "",
  description: "",
};
