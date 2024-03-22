//** https://formik.org/docs/tutorial#leveraging-react-context
/**
 * Trước tiên thì chúng ta tìm hiểu context trước.
 */
import { FormikConfig, FormikValues, useFormik } from 'formik';
import { PropsWithChildren, createContext, useContext } from 'react';

// ** Tạo ra một context Formik để bao bọc toàn bộ được tất cả các ô input không quan trọng ô input đó được đặt ở component nào, miễn là nằm trong FormikContext
const FormikContext = createContext<any>(null);

// ** Tạo ra Provider để bao bọc
function Formik({
  children,
  ...props
}: PropsWithChildren<FormikConfig<FormikValues>>) {
  const value = useFormik({ ...props });
  return (
    <FormikContext.Provider value={value}>{children}</FormikContext.Provider>
  );
}

// ** Tạo custome hook để lấy giá trị từ useFormik truyền xuống thông qua context.
// ** Không cần truyền thông qua props cho dài dòng :D
const useFormikStore = () => {
  const value = useContext(FormikContext);
  if (!value) {
    throw new Error(
      'Muốn sử dụng useFormik thì phải bọc component của bạn trong Formik'
    );
  }

  return value;
};

// ** Để sử dụng được component này thì phải có component Formik bao bọc
// ** tại vì trong component Field có sử dụng useFormikStore -> chính là sử dụng FormikContext
function Field({ name }: { name: string }) {
  const { getFieldProps } = useFormikStore();
  return (
    <>
      <input {...getFieldProps(name)} />{' '}
    </>
  );
}

function ErrorMessage({ name }: { name: string }) {
  const { errors, touched } = useFormikStore();

  return (
    <>
      {touched['name'] && errors['name'] && (
        <p className="text-red-500">{errors['name']}</p>
      )}
    </>
  );
}

// -- Giải thích vấn đề 1:
export function DemoContextFormik() {
  /**
   * Nếu code như thế này:
   * Mục tiêu:
   * - Chúng ta muốn lấy function handleSubmit từ useFormikStore để gắn cho form
   * Vấn đề:
   * - Không thể gọi useFormikStore tại đây được? vì sao
   * - Vì Component DemoContextFormik đâu có được bọc bởi `Formik`, chỉ có form, và `Field` là bọc bởi `Formik` còn `Formik` là con của `DemoContextFormik`
   * - Vậy thì làm sao để lấy được handleSubmit của `FormikContext`?
   * Giải pháp:
   * - 1. Chúng ta sẽ tạo component form riêng mà component form đó đã được bọc bởi `Formik`
   * - 2. Chúng ta sẽ truyền children là 1 function và `Formik` sẽ gọi function children và truyền dữ liệu context xuống ngược lại
   */

  // ** Vấn đề

  useFormikStore();
  return (
    <Formik
      initialValues={{
        email: 'daingo@gmail.com',
      }}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {/* children = function */}
      {(values) => {
        return <p>hello</p>;
      }}
      {/* <p>hello</p> */}

      {/* --- */}
      {/* <form>
        <Field name="email" />
        <button type="submit">Submit</button>
      </form> */}
    </Formik>
  );
}
