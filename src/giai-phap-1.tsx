import { FormikConfig, FormikValues, useFormik } from 'formik';
import { PropsWithChildren, createContext, useContext } from 'react';

const FormikContext = createContext<any>(null);

function Formik({
  children,
  ...props
}: PropsWithChildren<FormikConfig<FormikValues>>) {
  const value = useFormik({ ...props });
  return (
    <FormikContext.Provider value={value}>{children}</FormikContext.Provider>
  );
}

const useFormikStore = () => {
  const value = useContext(FormikContext);

  if (!value) {
    throw new Error(
      'Muốn sử dụng useFormik thì phải bọc component của bạn trong Formik'
    );
  }

  return value;
};

function Field({ name }: { name: string }) {
  const { getFieldProps } = useFormikStore();
  return (
    <>
      <input {...getFieldProps(name)} />{' '}
    </>
  );
}

export function DemoContextFormik() {
  return (
    <Formik
      initialValues={{
        email: 'daingo@gmail.com',
      }}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <FormLogin />
    </Formik>
  );
}

/**
 * Tách ra component riêng thì lúc này chúng ta có thể lấy function handleSubmit được vì nó đảm bảo được bọc vởi `Formik` :D
 * 
 */
function FormLogin() {
  const { handleSubmit } = useFormikStore();

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Field name="email" />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
