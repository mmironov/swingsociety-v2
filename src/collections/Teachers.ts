import type { CollectionConfig } from 'payload'
import { revalidateHooks } from '../hooks/revalidate'
import { anyone, editors } from '../access'

export const Teachers: CollectionConfig = {
  slug: 'teachers',
  labels: { singular: 'Преподавател', plural: 'Екип' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'disciplines', 'active', 'order'],
    group: 'Съдържание',
    description: 'Хората в секция „Екип“. Подреждат се по полето „Ред“.',
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Име',
      required: true,
      localized: true,
      admin: { description: 'Както да се покаже на сайта, напр. „Калина К.“' },
    },
    {
      name: 'disciplines',
      type: 'text',
      label: 'Какво води',
      localized: true,
      admin: { description: 'Кратък ред под името, напр. „Линди хоп, Джаз, Степ“.' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Снимка',
      admin: {
        description:
          'Портретна снимка (по-висока, отколкото широка). Без снимка се показва плочка с първата буква от името.',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Кратко представяне',
      localized: true,
      admin: { description: 'Не се показва в решетката — запазено за бъдеща страница на преподавател.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Показвай на сайта',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ред',
      defaultValue: 0,
      admin: { position: 'sidebar', step: 1, description: 'По-малкото число излиза по-напред.' },
    },
  ],
  hooks: revalidateHooks,
}
