import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Потребител', plural: 'Потребители' },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Настройки',
  },
  access: {
    // Anyone logged in can read the user list; only admins may create, edit
    // other people's accounts, or delete.
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // Editors may only update their own record.
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Име',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Роля',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
      ],
      access: {
        // An editor must not be able to promote themselves to admin.
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        description:
          'Редакторите променят съдържание. Администраторите освен това управляват потребители.',
      },
    },
  ],
}
