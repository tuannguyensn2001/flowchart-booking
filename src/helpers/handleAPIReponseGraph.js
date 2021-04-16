export const handleResponseNodeConnection = (data) => {
    const convert = data.node.map(item => {
        const {x, y} = JSON.parse(item.location) || {x: Math.random()*500,y: Math.random()*500} ;
        return {
            id: item.id + "",
            data: {
                label: item.name,
                def: item,
            },
            position: {
                x, y
            },

        }
    })

    const connections = data.connection.map(connection => {
        const source = connection['wf_def_detail_parent_id'];
        const target = connection['wf_def_detail_id'];

        return {
            id: `${source}-${target}`,
            source,
            target,
            arrowHeadType: 'arrow',
            isThread: connection.isThread
        }
    })


    return [convert, connections];
}