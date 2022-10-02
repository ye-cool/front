import { request } from 'umi';

export async function getRandomPicture() {
  return request(`/api/cover/getRandomPicture`, {
    method: 'GET',
  });
}

export async function getTextCover(text, picture) {
  return request(`/api/cover/getTextCover`, {
    method: 'POST',
    data:{inputText:text,carrierPicture:picture}
  });
}

export async function getPictureCover(inputPicture, picture) {
  return request(`/api/cover/getPictureCover`, {
    method: 'POST',
    data:{inputPicture:inputPicture,carrierPicture:picture}
  });
}
