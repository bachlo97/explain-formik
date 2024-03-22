/**
 * Như phân tích thì chúng ta sẽ chuyền children của `Formik` về dạng function
 * Chúng ta sẽ gọi truyền giá trị values của useFormik() cho function children đó.
 * Sau khi function children được gọi thì nó sẽ render ra giao diện
 *
 * Mình sẽ ghi từng bước một cách bạn xem theo chỉ dẫn nha.
 */

import { FormikConfig, FormikValues, useFormik } from 'formik';
import React, { PropsWithChildren, createContext, useContext } from 'react';


const FormikContext = createContext<any>(null);

/**
 * kiểu dữ liệu PropsWithChildren: không còn phù hợp vì children có thể là một function
 * mình sẽ tự định nghĩa lại
 */

type TMyChildren<T> = ((values: any) => React.ReactNode) & PropsWithChildren<T>;

function Formik({
  children,
  ...props
}: TMyChildren<FormikConfig<FormikValues>>) {
  const value = useFormik({ ...props });
  // -- Step 1: Children là function, kiểm tra nếu children là function thì gọi function và truyền giá trị, ngược thì thì binding bình thường
  return (
    <FormikContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </FormikContext.Provider>
  );
}

const useFormikStore = () => {
  const value = useContext(FormikContext);
  console.log({value})
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
      {/* -- Step 2: truyền props children dưới dạng function */}
      {/* @ts-ignore */}
      {(value) => {
        const { handleSubmit } = value;
        // Chắc chắn phải có return để render ra giao diện đúng không, chớ trả về undefined thì sao có trên giao diện
        return (
          <>
            <form onSubmit={handleSubmit}>
              <Field name="email" />
              <button type="submit">Submit</button>
            </form>
          </>
        );
      }}
    </Formik>
  );
}
