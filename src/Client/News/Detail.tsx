import { useArchive } from "@/hooks/useArchive";
import { IPost } from "@/services/store/post/post.model";
import { IPostInitialState } from "@/services/store/post/post.slice";
import { getPostId } from "@/services/store/post/post.thunk";
import { useEffect, useState } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";

const Detail = () => {
    const { id } = useParams();
    const { state, dispatch } = useArchive<IPostInitialState>("post");
    const [data, setData] = useState<IPost>();
    useEffect(() => {
        if (id) {
            dispatch(getPostId(id))
        }
    }, [])
    useEffect(() => {
        if (!!state.activePost) {
            setData(state.activePost);
        }
    }, [JSON.stringify(state.activePost)]);
    const formattedTime = state.activePost?.created_at
        ? new Date(state.activePost.created_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Không rõ thời gian";
    return (

        <div className="my-4 py-4 px-6 space-y-2 border rounded-md text-black-400">
            <h3 className="mt-1 text-2xl font-bold text-black-500">{data?.short_title}</h3>
            <div className="flex gap-2">
                <div className="flex items-center font-medium">
                    <IoTimeOutline className="mr-2" /> {formattedTime}
                </div>
                {/* <div className="flex items-center">
                    <IoEyeOutline className="mr-2" /> Đã xem: {view}
                </div> */}
            </div>
            <h3 className="mt-1 font-bold">{data?.title}</h3>
            <img src={`${import.meta.env.VITE_API_URL}/${data?.thumbnail}`} alt="" className="w-2/3 rounded-md mx-auto object-cover" />
            <p className="mt-2"><div dangerouslySetInnerHTML={{ __html: data?.content as string }} /></p>
        </div>
    )
}

export default Detail