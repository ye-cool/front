import { request } from 'umi';

export async function getRumorData(index) {
  return request(`/api/rumor/getRumorData/${index}`, {
    method: 'GET',
  });
}

export async function onHandleRumor(id, isRumor) {
  return request(`/api/rumor/handleRumor`, {
    method: 'POST',
    data: { id: id, confirm: isRumor }
  });
}


