export const TextAlign = (props: any) => {
  return (
    <div style={{ textAlign: props.markType ? props.markType : 'left', width: '100%' }}>
      {props.children}
    </div>
  )
}