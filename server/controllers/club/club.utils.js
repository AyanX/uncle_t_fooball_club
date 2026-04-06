const validStat = (stat) => {
 return stat.label && stat.value
}
const validStatToClient = stats => {
    return stats.map(stat => ({
        id: stat.id,
        label: stat.label,
        value: stat.value,
        icon: stat.icon
    }))
}

const singleStatToClient = stat => {
    return {
        id: stat.id,
        label: stat.label,
        value: stat.value,
        icon: stat.icon
     }}

const validMilestone = (milestone) => {
    return milestone.title && milestone.content && milestone.year
}

const validMilestoneToClient = milestones => {
    return milestones.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        content: milestone.content,
        year: milestone.year
    }))
}


const singleMilestoneToClient = milestone => {
    return {
        id: milestone.id,
        title: milestone.title,
        content: milestone.content,
        year: milestone.year
     }
}

const validMission = (mission) => {
    return mission.title && mission.content
}

const validMissionToClient = missions => {
    return missions.map(mission => ({
        id: mission.id,
        title: mission.title,
        content: mission.content,
    }))
}


const singleMissionToClient = mission => {
    return {
        id: mission.id,
        title: mission.title,
        content: mission.content,
     }  }


const validManagement = (management) => {
    return management.name && management.role
}
const validManagementToClient =( managements, fakeId=0) => {
    return managements.map(management => ({
        id: management.id || fakeId,
        name: management.name,
        role: management.role,
        image: management.image,
        blur_image: management.blur_image
    }))
}

const singleManagementToClient = (management) => {
    return {
        id: management.id,
        name: management.name,
        role: management.role,
        image: management.image,
        blur_image: management.blur_image
     }}



module.exports = {
    validStat,
    singleManagementToClient,
    validMission,
    validMissionToClient,
    validStatToClient,
    validMilestone,
    validMilestoneToClient,
    validManagement,
    singleStatToClient,
    validManagementToClient,
    singleMilestoneToClient,
    singleMissionToClient
}