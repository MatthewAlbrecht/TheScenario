'use client';

import { Formik, Form, Field, FormikHelpers } from 'formik';
import {
  UseMutationResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import queryClient, {
  deleteData,
  getAllData,
  postData,
  putData,
} from './queryClient';
import { Dispatch, SetStateAction, useState } from 'react';
import { Data, DataWithoutId } from './types';

export default function Page() {
  const [editData, setEditData] = useState<Data | null>(null);

  const { data, isLoading } = useQuery<Data[]>({
    queryKey: ['data'],
    queryFn: getAllData,
  });

  const createDataMutation = useMutation({
    mutationFn: postData,
    onSuccess: async () => {
      return await queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  const updateDataMutation = useMutation({
    mutationFn: putData,
    onSuccess: async () => {
      return await queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  const deleteDataMutation = useMutation({
    mutationFn: deleteData,
    onSuccess: async () => {
      return await queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });

  function handleSubmit(
    values: DataWithoutId,
    actions: FormikHelpers<DataWithoutId>
  ) {
    if (editData) {
      updateDataMutation.mutate(
        { ...values, _id: editData._id },
        {
          onSuccess: () => {
            actions.resetForm();
            setEditData(null);
          },
        }
      );
    } else {
      createDataMutation.mutate(values, {
        onSuccess: () => actions.resetForm(),
      });
    }
  }

  function handleDelete(id: string) {
    deleteDataMutation.mutate(id);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4">
            {Boolean(editData) ? 'Update' : 'Add'} Data
          </h2>
          <Formik<DataWithoutId>
            initialValues={{ data: editData?.data || '' }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            <Form>
              <Field
                className="h-9 mr-2 rounded text-black px-4"
                type="text"
                name="data"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                type="submit"
              >
                {Boolean(editData) ? 'Update' : 'Submit'}
              </button>
              {createDataMutation.isPending ||
                (updateDataMutation.isPending && <div>Loading...</div>)}
              {createDataMutation.isError && (
                <div>Error: {createDataMutation.error.message}</div>
              )}
              {updateDataMutation.isError && (
                <div>Error: {updateDataMutation.error.message}</div>
              )}
              {createDataMutation.isSuccess && (
                <div>Post submitted successfully!</div>
              )}
              {updateDataMutation.isSuccess && (
                <div>Post updated successfully!</div>
              )}
            </Form>
          </Formik>
        </section>
        <DataList
          isLoading={isLoading}
          data={data}
          createDataMutation={createDataMutation}
          handleDelete={handleDelete}
          setEditData={setEditData}
        />
      </div>
    </main>
  );
}

function DataList({
  isLoading,
  data,
  createDataMutation,
  handleDelete,
  setEditData,
}: {
  isLoading: boolean;
  data: Data[] | undefined;
  createDataMutation: UseMutationResult<any, Error, DataWithoutId, unknown>;
  handleDelete: (id: string) => void;
  setEditData: Dispatch<SetStateAction<Data | null>>;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">My beautiful list of data</h2>
      {isLoading && <div>Loading...</div>}
      {data && data.length === 0 && <div>No data found</div>}
      {data && data.length > 0 && (
        <ul className="space-y-1">
          {data.map((d) => (
            <DataListItem
              d={d}
              key={d._id}
              setEditData={setEditData}
              handleDelete={handleDelete}
            />
          ))}
          {/* optimistic rendering of newly added data */}
          {createDataMutation.isPending && (
            <li style={{ opacity: 0.5 }}>
              {createDataMutation.variables.data}
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

function DataListItem({
  d,
  setEditData,
  handleDelete,
}: {
  d: Data;
  setEditData: Dispatch<SetStateAction<Data | null>>;
  handleDelete: (id: string) => void;
}) {
  return (
    <li key={d._id} className="flex justify-between">
      <span>{d.data}</span>
      <div>
        <button
          onClick={() => setEditData(d)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-1 rounded ml-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(d._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-1 rounded ml-2"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
