import React, { useState } from "react";
import useGetData from "../../hooks/useGetData";
import SpinnerFullPage from "../../Ui/SpinnerFullPage";
import { FaRegTrashCan } from "react-icons/fa6";
import Header from "../../Ui/Header";
import Button from "../../components/Button";
import Model from "../../Ui/Model";
import { Controller, useForm } from "react-hook-form";
import Input from "../../components/Input";
import axiosInstance from "../../axiosInstance";
import ConfirmDelete from "../../Ui/ConfirmDelete";

const BookGenres = () => {
  const [addGenreModel, setAddGenreModel] = useState(false);
  const [addGenreLoader, setAddGenreLoader] = useState(false);
  // delete genre
  const [deleteGenreModel, setDeleteGenreModel] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const { data, loading, fetchData } = useGetData(`/api/genre/`);

  const {
    setError,
    reset,
    setValue,
    control,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm({
    defaultValues: {
      title: "",
    },
    mode: "onChange",
  });
  // add genre
  const onSubmit = async (data) => {
    try {
      setAddGenreLoader(true);
      console.log(data, "kjkjk");
      const response = await axiosInstance.post("/api/genre/", data);
      if (response.status === 201) {
        reset();
        setAddGenreModel(false);

        fetchData();
      }
    } catch (err) {
      if (err?.response.data?.errors.includes("Duplicate title")) {
        setError("title", {
          message: "Title must be unique",
        });
      }

      console.log(err);
    } finally {
      setAddGenreLoader(false);
    }
  };
  if (loading) return <SpinnerFullPage />;
  return (
    <>
      <div className="grid gap-8">
        <Header title="Genre">
          <Button onClick={() => setAddGenreModel(true)}>Add Genre</Button>
        </Header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.data?.map((item) => (
            <div
              key={item?._id}
              className=" shadow-main flex items-center justify-between py-4 px-3 rounded-sm"
            >
              <span className="text-natural-dark capitalize">
                {item?.title}
              </span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  setDeleteId(item?._id);
                  setDeleteGenreModel(true);
                }}
              >
                <FaRegTrashCan color={`var(--error)`} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <Model
        open={addGenreModel}
        onClose={() => setAddGenreModel(false)}
        header={<h1>Add Genre</h1>}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Controller
            name="title"
            control={control}
            rules={{
              required: "Title is required",
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  id="title"
                  label="Title"
                  type="text"
                  placeholder="Enter genre title"
                  error={error?.message || errors?.title?.message}
                  handleChange={field.onChange}
                  value={field.value}
                  disabled={loading}
                />
              </>
            )}
          />
          <div className="flex items-center justify-end gap-4">
            <Button
              role="submit"
              disabled={addGenreLoader}
              loading={addGenreLoader}
            >
              add Gerne
            </Button>
          </div>
        </form>
      </Model>
      {/* confirm delete  */}
      <ConfirmDelete
        open={deleteGenreModel}
        onClose={() => setDeleteGenreModel(false)}
        refetchData={fetchData}
        deleteLink={`/api/genre/${deleteId}`}
      />
    </>
  );
};

export default BookGenres;
