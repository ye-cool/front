import { request } from 'umi';

export async function getDeepfakeResult(inputPicture) {
  return request(`/api/deepfake/getDeepfakeResult`, {
    method: 'POST',
    data: { inputPicture: inputPicture }
  });
}

export async function getExamplePicture() {
  console.log(111)
  return request(`/api/deepfake/getExamplePicture`, {
    method: 'GET',
  });
}



