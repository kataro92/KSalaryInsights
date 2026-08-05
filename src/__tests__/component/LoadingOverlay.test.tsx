import { render } from '@testing-library/react-native';

import { LoadingOverlay } from '@/src/components/loading/LoadingOverlay';

describe('LoadingOverlay', () => {
  it('renders nothing when hidden', () => {
    const { toJSON } = render(<LoadingOverlay visible={false} />);
    expect(toJSON()).toBeNull();
  });

  it('shows message when visible', () => {
    const { getByLabelText, getByText } = render(
      <LoadingOverlay visible message="Đang xử lý…" />,
    );
    expect(getByLabelText('Đang xử lý…')).toBeTruthy();
    expect(getByText('Đang xử lý…')).toBeTruthy();
  });
});
