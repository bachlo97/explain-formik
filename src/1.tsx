import { FieldConfig, FieldInputProps, useFormik } from 'formik';

export function DemoUseFormik() {
  const { getFieldProps, handleSubmit } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <GroupUserName getFieldProps={getFieldProps} />
        <br />
        <GroupInfo getFieldProps={getFieldProps} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
/**
 * - Trong thực tế thì chúng ta đôi khi sẽ gặp trường hợp sẽ phải tách thành nhiều component để quản lý từng ô input group riêng biệt.
 * - Nhưng state thì chúng ta lưu ở trên component cha, và các hàm xử lý.
 * - Vậy thì để các component con có thì chúng ta phải truyền props xuống.
 *
 * => Kết luận trong README.md
 */
// -- Tách component
interface InputGroup {
  getFieldProps: (
    nameOrOptions: string | FieldConfig<any>
  ) => FieldInputProps<any>;
}
function GroupUserName({ getFieldProps }: InputGroup) {
  return (
    <>
      <input {...getFieldProps('firstName')} placeholder="first name" />
      <input {...getFieldProps('lastName')} placeholder="last name" />
    </>
  );
}

function GroupInfo({ getFieldProps }: InputGroup) {
  return (
    <>
      <input {...getFieldProps('phone')} placeholder="phone" />
      <input {...getFieldProps('address')} placeholder="address" />
    </>
  );
}
