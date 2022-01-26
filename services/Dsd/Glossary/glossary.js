import request from '@/utils/Platform/request';
import { getSessionCache } from '@/utils/Platform/platformUtil';
import { formatUrl } from '@/services/Mm/Assets/assets';

export async function getOwnedElementsOfElemnts(classId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/${classId}/get_element_by_class_id?diToken=${diToken}`;
  return request(url);
}

export async function saveElements(element) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/save_element?diToken=${diToken}`;
  return request(url, {
    method: 'POST',
    body: element,
  });
}

export async function getElement(elementId) {
  const diToken = getSessionCache('diToken');
  let url = `/di/MM/metadata/${elementId}/get_es_element?diToken=${diToken}`;
  return request(url);
}
