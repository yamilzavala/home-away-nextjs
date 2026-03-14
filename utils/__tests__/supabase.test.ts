import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadImage, supabase } from '../supabase';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  })),
}));

describe('supabase utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploadImage should upload a file and return the public URL', async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
    const mockData = { path: 'temp-home-away/test.png' };
    const mockPublicUrl = 'https://supabase.com/storage/v1/object/public/temp-home-away/test.png';

    const uploadMock = vi.fn().mockResolvedValue({ data: mockData, error: null });
    const getPublicUrlMock = vi.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } });

    vi.mocked(supabase.storage.from).mockReturnValue({
      upload: uploadMock,
      getPublicUrl: getPublicUrlMock,
    } as any);

    const result = await uploadImage(mockFile);

    expect(uploadMock).toHaveBeenCalled();
    expect(getPublicUrlMock).toHaveBeenCalled();
    expect(result).toBe(mockPublicUrl);
  });

  it('uploadImage should throw an error if upload fails', async () => {
    const mockFile = new File(['content'], 'test.png', { type: 'image/png' });

    vi.mocked(supabase.storage.from).mockReturnValue({
      upload: vi.fn().mockResolvedValue({ data: null, error: new Error('Upload failed') }),
      getPublicUrl: vi.fn(),
    } as any);

    await expect(uploadImage(mockFile)).rejects.toThrow('Image upload failed');
  });
});
