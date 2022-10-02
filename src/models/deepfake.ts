import { useRequest } from 'umi';
import { getDeepfakeResult, getExamplePicture } from '@/services/deepfake.js';

export default function deepfake() {

  const examplePicture = useRequest(getExamplePicture,
    {
      formatResult: (response) => {
        return response
      },
      onSuccess: (data, params) => {

      }
    });

  const deepfake = useRequest(getDeepfakeResult,
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
    dataSource: deepfake?.data,
    loading: deepfake?.loading,
    run: deepfake.run,
    examplePicture: examplePicture?.data
  };

}