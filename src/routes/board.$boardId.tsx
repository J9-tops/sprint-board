import { createFileRoute } from '@tanstack/react-router'
import { BoardViewPage } from '../components/board/BoardViewPage'

export const Route = createFileRoute('/board/$boardId')({
  component: BoardViewPage,
})
