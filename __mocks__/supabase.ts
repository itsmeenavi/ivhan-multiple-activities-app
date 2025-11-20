// Mock Supabase client for testing

export const mockUser = {
  id: 'test-user-id-123',
  email: 'test@example.com',
  user_metadata: {
    display_name: 'Test User',
  },
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2024-01-01T00:00:00.000Z',
}

export const mockTodos = [
  {
    id: 'todo-1',
    user_id: 'test-user-id-123',
    title: 'Test Todo 1',
    completed: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'todo-2',
    user_id: 'test-user-id-123',
    title: 'Test Todo 2',
    completed: true,
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
  },
]

export const mockPhotos = [
  {
    id: 'photo-1',
    user_id: 'test-user-id-123',
    name: 'Test Photo',
    url: 'https://example.com/photo.jpg',
    size: 1024,
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

export const mockFoodPhotos = [
  {
    id: 'food-1',
    user_id: 'test-user-id-123',
    name: 'Pizza',
    url: 'https://example.com/pizza.jpg',
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

export const mockFoodReviews = [
  {
    id: 'review-1',
    food_photo_id: 'food-1',
    user_id: 'test-user-id-123',
    rating: 5,
    comment: 'Delicious!',
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

export const mockPokemonReviews = [
  {
    id: 'poke-review-1',
    pokemon_id: 25,
    pokemon_name: 'pikachu',
    user_id: 'test-user-id-123',
    rating: 5,
    comment: 'Awesome Pokemon!',
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

export const mockNotes = [
  {
    id: 'note-1',
    user_id: 'test-user-id-123',
    title: 'Test Note',
    content: '# Hello\nThis is a **test** note.',
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

export const mockProfiles = [
  {
    id: 'test-user-id-123',
    display_name: 'Test User',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00.000Z',
  },
]

// Mock Supabase client methods
export const createMockSupabaseClient = () => ({
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: { session: { user: mockUser, access_token: 'mock-token' } },
      error: null,
    }),
    getUser: jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { user: mockUser, session: { access_token: 'mock-token' } },
      error: null,
    }),
    signUp: jest.fn().mockResolvedValue({
      data: { user: mockUser, session: { access_token: 'mock-token' } },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({
      error: null,
    }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
  },
  from: jest.fn((table: string) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: table === 'profiles' ? mockProfiles[0] : null,
      error: null,
    }),
    order: jest.fn().mockReturnThis(),
    then: jest.fn((callback) => {
      const data = {
        todos: mockTodos,
        photos: mockPhotos,
        food_photos: mockFoodPhotos,
        food_reviews: mockFoodReviews,
        pokemon_reviews: mockPokemonReviews,
        notes: mockNotes,
        profiles: mockProfiles,
      }[table] || []
      return callback({ data, error: null })
    }),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn().mockResolvedValue({
        data: { path: 'mock-path.jpg' },
        error: null,
      }),
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/mock-image.jpg' },
      }),
      remove: jest.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    })),
  },
})

// Mock the Supabase client module
jest.mock('@/lib/supabase/client', () => ({
  supabase: createMockSupabaseClient(),
}))

