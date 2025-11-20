import { mockUser, createMockSupabaseClient } from '../__mocks__/supabase'

describe('Supabase Auth Integration Tests', () => {
  describe('User Object Properties', () => {
    it('authenticated user has required id property', () => {
      expect(mockUser).toHaveProperty('id')
      expect(typeof mockUser.id).toBe('string')
      expect(mockUser.id).toBeTruthy()
    })

    it('authenticated user has required email property', () => {
      expect(mockUser).toHaveProperty('email')
      expect(typeof mockUser.email).toBe('string')
      expect(mockUser.email).toContain('@')
    })

    it('authenticated user has user_metadata with display_name', () => {
      expect(mockUser).toHaveProperty('user_metadata')
      expect(mockUser.user_metadata).toHaveProperty('display_name')
      expect(typeof mockUser.user_metadata.display_name).toBe('string')
    })

    it('authenticated user has role property set to authenticated', () => {
      expect(mockUser).toHaveProperty('role')
      expect(mockUser.role).toBe('authenticated')
    })

    it('authenticated user has aud property', () => {
      expect(mockUser).toHaveProperty('aud')
      expect(mockUser.aud).toBe('authenticated')
    })

    it('authenticated user has created_at timestamp', () => {
      expect(mockUser).toHaveProperty('created_at')
      expect(typeof mockUser.created_at).toBe('string')
    })
  })

  describe('Supabase Client Methods', () => {
    let supabaseClient: ReturnType<typeof createMockSupabaseClient>

    beforeEach(() => {
      supabaseClient = createMockSupabaseClient()
    })

    it('getSession returns user with expected properties', async () => {
      const { data, error } = await supabaseClient.auth.getSession()
      
      expect(error).toBeNull()
      expect(data.session).toBeDefined()
      expect(data.session?.user).toHaveProperty('id')
      expect(data.session?.user).toHaveProperty('email')
      expect(data.session?.user).toHaveProperty('user_metadata')
      expect(data.session?.user.user_metadata).toHaveProperty('display_name')
    })

    it('signInWithPassword returns user with expected properties', async () => {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      })
      
      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user).toHaveProperty('id')
      expect(data.user).toHaveProperty('email')
      expect(data.user).toHaveProperty('user_metadata.display_name')
      expect(data.session).toHaveProperty('access_token')
    })

    it('signUp returns user with expected properties', async () => {
      const { data, error } = await supabaseClient.auth.signUp({
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            display_name: 'New User',
          },
        },
      })
      
      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user).toHaveProperty('id')
      expect(data.user).toHaveProperty('email')
      expect(data.user).toHaveProperty('user_metadata')
    })
  })

  describe('Database Query Integration', () => {
    let supabaseClient: ReturnType<typeof createMockSupabaseClient>

    beforeEach(() => {
      supabaseClient = createMockSupabaseClient()
    })

    it('profiles table returns user with display_name', async () => {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', mockUser.id)
        .single()
      
      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('display_name')
      expect(data).toHaveProperty('email')
    })

    it('todos table returns data with user_id', async () => {
      const { data, error } = await supabaseClient
        .from('todos')
        .select('*')
        .eq('user_id', mockUser.id)
      
      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
      
      if (data && data.length > 0) {
        expect(data[0]).toHaveProperty('id')
        expect(data[0]).toHaveProperty('user_id')
        expect(data[0]).toHaveProperty('title')
        expect(data[0]).toHaveProperty('completed')
      }
    })
  })

  describe('Error Handling', () => {
    it('handles invalid login credentials gracefully', async () => {
      const supabaseClient = createMockSupabaseClient()
      
      // Mock a failed login
      supabaseClient.auth.signInWithPassword = jest.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      })
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })
      
      expect(error).toBeDefined()
      expect(error?.message).toBe('Invalid login credentials')
      expect(data.user).toBeNull()
    })
  })
})

