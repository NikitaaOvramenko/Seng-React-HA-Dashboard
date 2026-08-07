export const ringtone = {
    giornos_ringtone:"/local/seng-dashboard-react/ringtones/giornos_theme.mp3",
    josuke_ringtone:"/local/seng-dashboard-react/ringtones/josuke_theme.mp3",
    judas_ringtone:"/local/seng-dashboard-react/ringtones/judas.mp3"
};

export type RingtoneId = keyof typeof ringtone;

export const ringtoneOptions: ReadonlyArray<{ id: RingtoneId; label: string }> = [
  { id: "giornos_ringtone", label: "Giorno's Theme" },
  { id: "josuke_ringtone", label: "Josuke's Theme" },
  { id: "judas_ringtone", label: "Judas" },
];
