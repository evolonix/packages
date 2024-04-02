import { useNavigate } from 'react-router-dom';
import { SearchInput } from '../../components';
import { useWidgets } from '../../lib/widgets';
import { WidgetList } from './components';

export const Widgets = () => {
  const [{ isLoading, searchQuery }, { handleSearch, isSearching }] =
    useWidgets(true, ({ isLoading, searchQuery }) => ({
      isLoading,
      searchQuery,
    }));
  const navigate = useNavigate();

  return (
    <>
      <h1 className="mb-4">Widgets</h1>
      <div className="mb-2 flex flex-wrap items-center justify-end gap-4 sm:justify-between">
        <SearchInput
          autoFocus
          className="w-full sm:max-w-sm"
          isLoading={isLoading}
          isSearching={isSearching}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />

        <button
          className="btn-primary"
          disabled={isLoading}
          type="button"
          onClick={() => navigate('/widgets/new')}
        >
          New
        </button>
      </div>

      <WidgetList />
    </>
  );
};
