import { useRequest, useState } from 'umi';
import { getRandomPicture, getTextCover, getPictureCover } from '@/services/cover.js';

let result = {}

export default function cover() {

  const randomPicture = useRequest(getRandomPicture,
    {
      formatResult: (response) => {
        console.log(response)
        return response
      },
      onSuccess: (data, params) => {

      }
    });

  const textCover = useRequest(getTextCover,
    {
      manual: true,
      formatResult: (response) => {
        console.log(response)
        return response
      },
      onSuccess: (data, params) => {

      }
    });

  const pictureCover = useRequest(getPictureCover,
    {
      manual: true,
      formatResult: (response) => {
        console.log(response)
        return response
      },
      onSuccess: (data, params) => {

      }
    });
  return {
    dataSource: randomPicture?.data,
    loading: randomPicture?.loading,
    run: randomPicture.run,
    onGetTextCover: textCover.run,
    onGetPictureCover: pictureCover.run,
    result: pictureCover?.data?.data,
    textResult: textCover?.data?.data,
    coverLoading: pictureCover?.loading || textCover?.loading
  };

}