import { normalize, schema } from "normalizr";

const blogPosts = [
  {
    id: 'post1',
    author: { username: 'user1', name: 'User 1' },
    body: '......',
    comments: [
      {
        id: 'comment1',
        author: { username: 'user2', name: 'User 2' },
        comment: '.....'
      },
      {
        id: 'comment2',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....'
      }
    ]
  },
  {
    id: 'post2',
    author: { username: 'user2', name: 'User 2' },
    body: '......',
    comments: [
      {
        id: 'comment3',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....'
      },
      {
        id: 'comment4',
        author: { username: 'user1', name: 'User 1' },
        comment: '.....'
      },
      {
        id: 'comment5',
        author: { username: 'user3', name: 'User 3' },
        comment: '.....'
      }
    ]
  },
  {
    id: 'post3',
    author: { username: 'user3', name: 'User 3' },
    body: '......',
    comments: [
      {
        id: 'comment9',
        author: { username: 'user1', name: 'User 3' },
        comment: '.....'
      },
      {
        id: 'comment8',
        author: { username: 'user2', name: 'User 1' },
        comment: '.....'
      },
      {
        id: 'comment11',
        author: { username: 'user10', name: 'User 3' },
        comment: '.....'
      }
    ]
  }
]

const userEntity = new schema.Entity('users')
const commentEntity = new schema.Entity('comments', {
  commenter: userEntity,
})

const userEntityV2 = new schema.Entity('users', {}, { idAttribute: 'username' });

const commentEntityV2 = new schema.Entity('comments', {
  commenter: userEntityV2,
})
const postEntity = new schema.Entity('post', {
  author: userEntityV2,
  comments: [commentEntityV2],
})

const normalizedV2 = normalize(blogPosts, [postEntity])

console.log(normalizedV2.entities);
