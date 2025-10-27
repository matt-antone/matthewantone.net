enum DisplayTextLevels {
  Display1 = '4rem',
  Display2 = '3.5rem',
  Display3 = '3rem',
  Display4 = '2.5rem',
  Display5 = '2rem',
  Display6 = '1.5rem',
}
export const DisplayTextIcon = (level: number) => (
  <span style={{ fontWeight: 'bold', fontSize: DisplayTextLevels[`Display${level}` as keyof typeof DisplayTextLevels] }}>D{level}</span>
)