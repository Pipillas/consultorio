import Table from '../../components/Table.js';
import Redirect from '../../components/Redirect.js';

export default function Home({ params }) {
    if (params.tipoEstudio === 'radiografia' || params.tipoEstudio === 'ecografia') {
        return (
            <main>
                <Table tipoEstudio={params.tipoEstudio} params={true} />
            </main>
        )
    } else {
        return <Redirect />
    }
}