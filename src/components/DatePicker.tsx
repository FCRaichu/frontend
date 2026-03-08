interface Props {
  value: Date;
  onChange: (date: Date) => void;
}
// TODO: Date Picker 컴포넌트 만들기
export default function DatePicker({ value, onChange }: Props) {
  console.log(value, onChange);
  return (
    <>
      <div>Date Picker</div>
    </>
  );
}
